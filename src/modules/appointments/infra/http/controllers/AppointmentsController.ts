import { Request, Response } from 'express';
import { container } from 'tsyringe';
import CriarAgendamento from '@modules/appointments/services/CriarAgendamento';

export default class AppointmentsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;
    const { prestador_id, data } = request.body;

    const criarAgendamento = container.resolve(CriarAgendamento);

    const agendamento = await criarAgendamento.execute({
      prestador_id,
      user_id,
      data,
    });
    return response.json(agendamento);
  }
}
