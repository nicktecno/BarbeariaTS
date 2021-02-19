import AppError from '@shared/errors/AppError';

import FakeNotificationsRepository from '@modules/notifications/repositories/fakes/FakeNotificationsRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeRepositorioDeAgendamentos from '../repositories/fakes/FakeAppointmentsRepository';
import CriarAgendamento from './CriarAgendamento';

let fakeAppointmentsRepository: FakeRepositorioDeAgendamentos;
let fakeNotificationsRepository: FakeNotificationsRepository;
let fakeCacheProvider: FakeCacheProvider;
let createAppointment: CriarAgendamento;

describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeRepositorioDeAgendamentos();
    fakeNotificationsRepository = new FakeNotificationsRepository();
    fakeCacheProvider = new FakeCacheProvider();

    createAppointment = new CriarAgendamento(
      fakeAppointmentsRepository,
      fakeNotificationsRepository,
      fakeCacheProvider
    );
  });

  it('should be able to create a new appointment', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2021, 4, 10, 12).getTime();
    });

    const appointment = await createAppointment.execute({
      data: new Date(2021, 4, 10, 12),
      user_id: 'user-id',
      prestador_id: 'provider-id',
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.prestador_id).toBe('provider-id');
  });

  it('should not be able to create two appointments on the same time', async () => {
    const appointmentDate = new Date(2021, 4, 10, 12);

    await createAppointment.execute({
      data: appointmentDate,
      user_id: 'user-id',
      prestador_id: 'provider-id',
    });

    await expect(
      createAppointment.execute({
        data: appointmentDate,
        user_id: 'user-id',
        prestador_id: 'provider-id',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointments on a past date', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });
    await expect(
      createAppointment.execute({
        data: new Date(2020, 4, 10, 11),
        user_id: 'user-id',
        prestador_id: 'provider-id',
      })
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should not be able to create an appointment with same user as provider', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2021, 4, 10, 12).getTime();
    });
    await expect(
      createAppointment.execute({
        data: new Date(2021, 4, 10, 11),
        user_id: 'user-id',
        prestador_id: 'user-id',
      })
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should not be able to create an appointment with same user as provider', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2021, 4, 10, 12).getTime();
    });
    await expect(
      createAppointment.execute({
        data: new Date(2021, 4, 10, 11),
        user_id: 'user-id',
        prestador_id: 'user-id',
      })
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should not be able to create an appointment before 8am and after 5pm', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2021, 4, 10, 12).getTime();
    });
    await expect(
      createAppointment.execute({
        data: new Date(2021, 4, 11, 7),
        user_id: 'user-id',
        prestador_id: 'provider-id',
      })
    ).rejects.toBeInstanceOf(AppError);

    await expect(
      createAppointment.execute({
        data: new Date(2021, 4, 11, 18),
        user_id: 'user-id',
        prestador_id: 'provider-id',
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
