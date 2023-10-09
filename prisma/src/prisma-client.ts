import { Prisma, PrismaClient } from '@prisma/client';
import taskExtensions from './extensions/models/task';

// const tasksWithVotes = Prisma.validator<Prisma.TaskDefaultArgs>()({include: { votes: {
//     select: { user: { select: {email: true} }, points: true, createdAt: true, round: true }
// } }});
// type TasksWithVotes = Prisma.TaskGetPayload<typeof tasksWithVotes>

export const prisma = new PrismaClient({ log: ['query', 'info', 'warn', 'error'] })
.$extends({
    query: {
        task: {
            async create({ model, operation, args, query }){
                const { maxRounds, percentual } = await prisma.squad
                .findUniqueOrThrow({
                    select: { maxRounds: true, percentual:true },
                    where: { id: args.data.squadId }
                });
                
                args.data.maxRounds ??= maxRounds;
                args.data.percentual ??= percentual;

                return query(args);
            }   
        }
    }
})
.$extends(taskExtensions);

// async function vote(taskId: string, email: string, points: number){

//     /*
//      * Lógica de voto em tarefa
//      * 
//      * 1. Voto é válido?
//      *   1.1. Voto tem o formato certo? (points é um número aceito?)
//      *   1.2. Tarefa está ativa?
//      *   1.3. Usuário está na equipe da tarefa?
//      *   1.4. Usuário ainda não votou essa rodada?
//      */

//     // 1.1
//     validatePoints(points);

//     const task = await prisma.task.findUniqueOrThrow({
//         where: { id: taskId },
//         include: {
//             squad:{select:{users:{select:{user:{
//                 select: { email: true }
//             }}}}},
//             votes:{select:{user:{select: { email: true }},
//                 points: true,
//                 round: true,
//                 createdAt: true,
//             }}}
//     });

//     // 1.1
//     if(!task.active)
//         throw new Error("Cant vote in an unactive task!");

//     // 1.2
//     if(task.squad.users.every((obj) => obj.user.email != email))
//         throw new Error("User is not a part of this squad!");
    
//     /** Rodada atual do voto */
//     const round = task.currentRound;

//     /** Voto do usuario */
//     var userVote: vote | undefined = task.votes.find((obj) => (obj.round == round) && (obj.user.email == email));

//     // 1.3
//     if(userVote)
//         throw new Error("User already voted in this task!\n" + JSON.stringify(userVote));

//     /*
//      Se chegamos até aqui, o voto é válido.
//      A fazer: 
//         1. Registrar o voto no banco de dados.
//         2. Verificar se precisamos terminar a rodada.
//         3. Caso 2 seja verdade, verificar se a tarefa será finalizada.
//         4. Caso 3 seja verdade, atualizar a tarefa no banco de dados.
//     */

//     userVote = {
//         user: { email },
//         round,
//         createdAt: new Date(),
//         points
//     };

//     /** Lista com todos os votos da rodada */
//     const votes: vote[] = task.votes
//       .filter((vote) => vote.round == round)
//       .concat(userVote);

//     // Ainda há participantes para votar.
//     if(task.votes.length != task.squad.users.length - 1)
//         return registerVoteAndUpdate(taskId, userVote, undefined, true);

//     // A rodada deve ser finalizada

//     /** Pontos finais */
//    const finalPoints = calcFinalPoints(votes, round, task.maxRounds, task.percentual.toNumber());

//    return await registerVoteAndUpdate(taskId, userVote, finalPoints);
// }

// async function registerVoteAndUpdate(id: string, vote: vote, points?: number, nextRound: boolean = true){

//     const extraArgs = points ? ({points, active: false, finished:true}) : {};

//     return await prisma.task.update({
//         where: { id },
//         data: {
//             votes: {
//                 create: {
//                     user: {
//                         connect: { email: vote.user.email }
//                     },
//                     points: vote.points,
//                     round: vote.round
//                 }
//             },
//             currentRound: { increment: nextRound ? 1 : 0},
//             ...extraArgs
//         },
//         include: {
//             votes: {
//                 select: voteIncludeSelect,
//                 where: { round: { equals: vote.round } }
//             },
//             messages: {
//                 select: messageIncludeSelect,
//             }
//         }
//     });
// }

// /**
//  * 
//  * @param votes 
//  * @param currentRound 
//  * @param maxRounds 
//  * @param minPercentual 
//  * @returns 
//  */
// function calcFinalPoints(votes: vote[], currentRound: number, maxRounds: number, minPercentual: number): number | undefined{
//     /** Número mínimo de votos concordantes para termos um consenso.*/
//     const minFreq = votes.length * minPercentual;

//     /** Histograma com pontos: frequência */
//     const hist = new Map<number, number>();
//     for(const vote of votes)
//         hist.set(vote.points, (hist.get(vote.points) ?? 0) + 1);
    
//     /** Histograma em order decrescente de pontos */
//     const orderedHist = [...hist.entries()]
//         .sort(([a, b], [c, d]) => d - b);

//     // Ao menos uma estimativa obteve o valor mínimo de aprovação?
//     // TODO: verificar possivel bug.
//     if (orderedHist.some(([_, freq]) => minFreq))
//         return orderedHist[0][0];

//     // Chegamos ao numero maximo de rodadas?
//     if (currentRound == maxRounds)
//         return orderedHist[0][0];
    
//     // Caso contrario, a funcao retorna undefined.
// }

// /**
//  * 
//  * @param points 
//  * 
//  */
// function validatePoints(points: number): void {
//     if (!Number.isInteger(points) || points < 0){
//         throw new Error("Points can't be negative!");
//     }
// }