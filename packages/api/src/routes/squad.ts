import prisma from '@briefly/prisma';
import { type ZodiosRequestHandler } from '@zodios/express';
import type { Method, ZodiosPathsByMethod } from '@zodios/core';
import { squadsAPI, type SquadsAPI } from '@briefly/apidef';
import context, { type Context } from '../context'
import { mustAuth } from '../middlewares/authorization';
import * as sse from 'sse';

type SquadsHandler<M extends Method, Path extends ZodiosPathsByMethod<SquadsAPI, M>> =
  ZodiosRequestHandler<SquadsAPI, Context, M, Path>;

const squadsRouter = context.router(squadsAPI);

const create: SquadsHandler<"post", ""> = async (req, res, next) => {
  const data = req.body;
  try {
    const squad = await prisma.squad.create({
      data,
      include: {
        users: { select: { user: { select: {
          name: true,
          email: true,
          enabled: true,
          createdAt: true,
          updatedAt: true
        }}}}
      }
    });
    return res.status(201).json(squad);
  } catch (error: unknown) {
    next(error);
  }
}

const find: SquadsHandler<"get", "/:squadId"> = async (req, res, next) => {
  const id = req.params.squadId;

  try {
    const squad = await prisma.squad
      .findUniqueOrThrow({
        where: { id },
        include: {
          users: { select: { user: { select: {
            name: true,
            email: true,
            enabled: true,
            createdAt: true,
            updatedAt: true
          }}}}
        }
      });
      return res.status(200).json(squad);
  } catch (error: unknown) {
    next(error);
  }
}

const findAll: SquadsHandler<"get", ""> = async(req, res, next) => {
  const { email } = req.user;

  try {
    const squads = await prisma.squad
      .findMany({
        where: { users: { some: { user: { email }}}}
      });
      return res.status(200).json(squads);
  } catch (error: unknown) {
    next(error);
  }
}

const update: SquadsHandler<"put", "/:squadId"> = async(req, res, next) => {
  const id = req.params.squadId;

  try {
    const data = req.body;
    const squad = await prisma.squad
      .update({
        where: { id },
        data,
        include: {
          users: { select: { user: { select: {
            name: true,
            email: true,
            enabled: true,
            createdAt: true,
            updatedAt: true
          }}}}
        }
      });

    const channel = sse.getChannel(id);
    if(channel) channel.broadcast(squad, "squadUpdated");
    return res.status(200).json(squad);
  } catch (error: unknown) {
    next(error);
  }
}

const addUsers: SquadsHandler<"post", "/:squadId/users"> = async (req, res, next) => {
  const id = req.params.squadId;

  try {
    const { email, owner } = req.body;
    const squad =  await prisma.squad
      .update({
        where: { id },
        data: {
          users: {
            create: {
              user: {
                connect: { email },
              },
              enabled: owner,
            },
          },
        },
        include: {
          users: { select: { user: { select: {
            name: true,
            email: true,
            enabled: true,
            createdAt: true,
            updatedAt: true
          }}}}
        }
      });

    const addedUserSession = sse.getSession(email);
    if(addedUserSession){
      const channel = sse.register(squad.id, addedUserSession);
      channel.broadcast(squad, "addedUser");
    }

    return res.status(201).json(squad);
  } catch (error: unknown) {
    next(error);
  }
}

const delUsers: SquadsHandler<"delete", "/:squadId/users"> = async (req, res, next) => {
  const { squadId } = req.params;
  const { email } = req.query;

  try {
    const squad = await prisma.squad.update({
      where: { id: squadId },
      data: { users: { disconnect: { userEmail_squadId: { userEmail: email, squadId }}}},
      include: {
        users: { select: { user: { select: {
          name: true,
          email: true,
          enabled: true,
          createdAt: true,
          updatedAt: true
        }}}}
      }
    })

    return res.status(200).json(squad);
  } catch (error: unknown) {
    next(error);
  }
}

const findAllTasks: SquadsHandler<"get", "/:squadId/tasks"> = async (req, res, next) => {
  const { squadId } = req.params;
  const { active } = req.query;
  try {
    const tasks = await prisma.task.findMany({ where: { squadId, active }});
    return res.status(200).json(tasks)
  } catch(error: unknown){
    next(error);
  }
};

const createTask: SquadsHandler<"post", "/:squadId/tasks"> = async (req, res, next) => {
  const { squadId } = req.params;
  const data = {...req.body, squadId};
  try {
    const task = await prisma.$transaction(async (tx) => {
      const task = await tx.task.create({ data });
      
      await tx.squad.update({
        where: { id: squadId },
        data: { tasks: { connect: { id: task.id }}}
      });
      return task;
    });
  
    const channel = sse.getChannel(squadId);
    if(channel) channel.broadcast(task, "taskCreated");
    
    return res.status(201).json(task)
  } catch(error: unknown){
    next(error);
  }
};

squadsRouter.use(mustAuth);
squadsRouter.post("", create);
squadsRouter.get("", findAll);
squadsRouter.get("/:squadId", find);
squadsRouter.put("/:squadId", update);
squadsRouter.post("/:squadId/users", addUsers);
squadsRouter.delete("/:squadId/users", delUsers);
squadsRouter.get("/:squadId/tasks", findAllTasks);
squadsRouter.post("/:squadId/tasks", createTask);

export default squadsRouter;
