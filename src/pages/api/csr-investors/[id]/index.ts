import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { csrInvestorValidationSchema } from 'validationSchema/csr-investors';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.csr_investor
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getCsrInvestorById();
    case 'PUT':
      return updateCsrInvestorById();
    case 'DELETE':
      return deleteCsrInvestorById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getCsrInvestorById() {
    const data = await prisma.csr_investor.findFirst(convertQueryToPrismaUtil(req.query, 'csr_investor'));
    return res.status(200).json(data);
  }

  async function updateCsrInvestorById() {
    await csrInvestorValidationSchema.validate(req.body);
    const data = await prisma.csr_investor.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteCsrInvestorById() {
    const data = await prisma.csr_investor.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
