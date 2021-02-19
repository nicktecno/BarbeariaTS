import { Request, Response } from 'express';
import { container } from 'tsyringe';
import ListProviderAppointmentsService from '@modules/appointments/services/ListProvidersAppointmentsService';
import { classToClass } from 'class-transformer';

export default class ProviderAppointmentsController {
  public async index(request: Request, response: Response): Promise<Response> {
    const prestador_id = request.user.id;
    const { day, month, year } = request.query;

    const listProviderAppointments = container.resolve(
      ListProviderAppointmentsService
    );

    const agendamentos = await listProviderAppointments.execute({
      prestador_id,
      day: Number(day),
      month: Number(month),
      year: Number(year),
    });
    return response.json(classToClass(agendamentos));
  }
}
