import { v4 } from 'uuid';
import { isEqual, getMonth, getYear, getDate } from 'date-fns';

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import IFindAllInMonthFromProviderDTO from '@modules/appointments/dtos/IFIndAllInMonthFromProviderDTO';
import IFindAllInDayFromProviderDTO from '@modules/appointments/dtos/IFIndAllInDayFromProviderDTO';

import Agendamento from '../../infra/typeorm/entities/Appointments';

class FakeRepositorioDeAgendamentos implements IAppointmentsRepository {
  private agendamentos: Agendamento[] = [];

  public async findByDate(
    data: Date,
    prestador_id: string
  ): Promise<Agendamento | undefined> {
    const findAppointment = this.agendamentos.find(
      agendamento =>
        isEqual(agendamento.data, data) &&
        agendamento.prestador_id === prestador_id
    );

    return findAppointment;
  }

  public async findAllInMonthFromProvider({
    prestador_id,
    month,
    year,
  }: IFindAllInMonthFromProviderDTO): Promise<Agendamento[]> {
    const appointments = this.agendamentos.filter(agendamento => {
      return (
        agendamento.prestador_id === prestador_id &&
        getMonth(agendamento.data) + 1 === month &&
        getYear(agendamento.data) === year
      );
    });

    return appointments;
  }

  public async findAllInDayFromProvider({
    prestador_id,
    day,
    month,
    year,
  }: IFindAllInDayFromProviderDTO): Promise<Agendamento[]> {
    const appointments = this.agendamentos.filter(agendamento => {
      return (
        agendamento.prestador_id === prestador_id &&
        getDate(agendamento.data) === day &&
        getMonth(agendamento.data) + 1 === month &&
        getYear(agendamento.data) === year
      );
    });

    return appointments;
  }

  public async create({
    prestador_id,
    user_id,
    data,
  }: ICreateAppointmentDTO): Promise<Agendamento> {
    const appointment = new Agendamento();

    Object.assign(appointment, { id: v4(), data, prestador_id });
    // coloca dentro do objeto as informaçoes do segunda parametro id:uuid...

    this.agendamentos.push(appointment);

    return appointment;
  }
}

export default FakeRepositorioDeAgendamentos;
