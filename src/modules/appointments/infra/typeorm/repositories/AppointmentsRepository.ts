import { getRepository, Repository, Raw } from 'typeorm';

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import IFindAllInMonthFromProviderDTO from '@modules/appointments/dtos/IFIndAllInMonthFromProviderDTO';
import IFindAllInDayFromProviderDTO from '@modules/appointments/dtos/IFIndAllInDayFromProviderDTO';

import Agendamento from '../entities/Appointments';

class RepositorioDeAgendamentos implements IAppointmentsRepository {
  private ormRepository: Repository<Agendamento>;

  constructor() {
    this.ormRepository = getRepository(Agendamento);
  }

  public async findByDate(
    data: Date,
    prestador_id: string
  ): Promise<Agendamento | undefined> {
    const EncontreAgendamentos = await this.ormRepository.findOne({
      where: { data, prestador_id },
    });

    return EncontreAgendamentos;
  }

  public async findAllInMonthFromProvider({
    prestador_id,
    month,
    year,
  }: IFindAllInMonthFromProviderDTO): Promise<Agendamento[]> {
    const parsedMonth = String(month).padStart(2, '0'); // Coloca o 0 na frente do numero para poder receber na funcao Raw, pq ele por padrao recebe o mes apenas com o 0 na frente

    const appointments = await this.ormRepository.find({
      where: {
        prestador_id,
        data: Raw(
          dataFieldName =>
            `to_char(${dataFieldName}, 'MM-YYYY') = '${parsedMonth}-${year}'`
        ),
      },
      relations: ['user'],
    });
    return appointments;
  }

  public async findAllInDayFromProvider({
    prestador_id,
    day,
    month,
    year,
  }: IFindAllInDayFromProviderDTO): Promise<Agendamento[]> {
    const parsedDay = String(day).padStart(2, '0');
    const parsedMonth = String(month).padStart(2, '0');

    const appointments = await this.ormRepository.find({
      where: {
        prestador_id,
        data: Raw(
          dataFieldName =>
            `to_char(${dataFieldName}, 'DD-MM-YYYY') = '${parsedDay}-${parsedMonth}-${year}'`
        ),
      },
    });
    return appointments;
  }

  public async create({
    prestador_id,
    user_id,
    data,
  }: ICreateAppointmentDTO): Promise<Agendamento> {
    const appointment = this.ormRepository.create({
      prestador_id,
      user_id,
      data,
    });

    await this.ormRepository.save(appointment);

    return appointment;
  }
}

export default RepositorioDeAgendamentos;
