import { startOfHour, isBefore, getHours, format } from 'date-fns';
import { injectable, inject } from 'tsyringe';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import AppError from '@shared/errors/AppError';
import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import Agendamento from '../infra/typeorm/entities/Appointments';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IPedido {
  prestador_id: string;
  user_id: string;
  data: Date;
}

@injectable()
class CriarAgendamentoService {
  constructor(
    @inject('AppointmentsRepository')
    private agendamentosRepositorio: IAppointmentsRepository,
    @inject('NotificationsRepository')
    private notificationsRepository: INotificationsRepository,
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider
  ) {}

  public async execute({
    prestador_id,
    data,
    user_id,
  }: IPedido): Promise<Agendamento> {
    const DataAgendamento = startOfHour(data);

    if (isBefore(DataAgendamento, Date.now())) {
      throw new AppError("You can't create an appointment on a past date");
    }

    if (user_id === prestador_id) {
      throw new AppError("You can't create an appointment with yourself.");
    }
    if (getHours(DataAgendamento) < 8 || getHours(DataAgendamento) > 17) {
      throw new AppError(
        'You can only create appointments between 8am and 5pm'
      );
    }

    const ProcurarAgendamentosMesmaData = await this.agendamentosRepositorio.findByDate(
      DataAgendamento
    );
    if (ProcurarAgendamentosMesmaData) {
      throw new AppError('Esse agendamento já está marcado');
    }
    const agendamento = await this.agendamentosRepositorio.create({
      prestador_id,
      user_id,
      data: DataAgendamento,
    });
    const dateFormatted = format(DataAgendamento, "dd/MM/yyyy 'às' HH:mm'h'");

    await this.notificationsRepository.create({
      recipient_id: prestador_id,
      content: `Novo agendamento para dia ${dateFormatted}`,
    });

    await this.cacheProvider.invalidate(
      `provider-appointments:${prestador_id}:${format(
        DataAgendamento,
        'yyyy-M-d'
      )}`
    );

    return agendamento;
  }
}
export default CriarAgendamentoService;
