import Agendamento from '../infra/typeorm/entities/Appointments';
import ICreateAppointmentDTO from '../dtos/ICreateAppointmentDTO';
import IFindAllInMonthFromProviderDTO from '../dtos/IFIndAllInMonthFromProviderDTO';
import IFindAllInDayFromProviderDTO from '../dtos/IFIndAllInDayFromProviderDTO';

export default interface IAppointmentsRepository {
  create(data: ICreateAppointmentDTO): Promise<Agendamento>;
  findByDate(
    date: Date,
    prestador_id: string
  ): Promise<Agendamento | undefined>;
  findAllInMonthFromProvider(
    data: IFindAllInMonthFromProviderDTO
  ): Promise<Agendamento[]>;
  findAllInDayFromProvider(
    data: IFindAllInDayFromProviderDTO
  ): Promise<Agendamento[]>;
}
