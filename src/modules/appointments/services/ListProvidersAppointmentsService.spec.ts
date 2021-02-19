import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import ListProviderAppointmentsService from './ListProvidersAppointmentsService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let fakeCacheProvider: FakeCacheProvider;
let listProviderAppointments: ListProviderAppointmentsService;

describe('ListProviderAppointments', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    fakeCacheProvider = new FakeCacheProvider();
    listProviderAppointments = new ListProviderAppointmentsService(
      fakeAppointmentsRepository,
      fakeCacheProvider
    );
  });

  it('should be able to list the the appointments on a specific day', async () => {
    const appointment1 = await fakeAppointmentsRepository.create({
      prestador_id: 'provider',
      user_id: 'user',
      data: new Date(2021, 4, 20, 14, 0, 0),
    });
    const appointment2 = await fakeAppointmentsRepository.create({
      prestador_id: 'provider',
      user_id: 'user',
      data: new Date(2021, 4, 20, 15, 0, 0),
    });

    const appointments = await listProviderAppointments.execute({
      prestador_id: 'provider',
      year: 2021,
      month: 5,
      day: 20,
    });
    expect(appointments).toEqual([appointment1, appointment2]);
  });
});
