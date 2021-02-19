import { injectable, inject } from 'tsyringe';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import { classToClass } from 'class-transformer';
import Agendamento from '../infra/typeorm/entities/Appointments';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IRequest {
  prestador_id: string;
  day: number;
  month: number;
  year: number;
}

@injectable()
class ListProviderAppointmentsService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider
  ) {}

  public async execute({
    prestador_id,
    year,
    month,
    day,
  }: IRequest): Promise<Agendamento[]> {
    const cacheKey = `provider-appointments:${prestador_id}:${year}-${month}-${day}`;

    let appointments = await this.cacheProvider.recover<Agendamento[]>(
      cacheKey
    );

    if (!appointments) {
      appointments = await this.appointmentsRepository.findAllInDayFromProvider(
        {
          prestador_id,
          year,
          month,
          day,
        }
      );

      await this.cacheProvider.save(cacheKey, classToClass(appointments));
    }
    return appointments;
  }
}
export default ListProviderAppointmentsService;
