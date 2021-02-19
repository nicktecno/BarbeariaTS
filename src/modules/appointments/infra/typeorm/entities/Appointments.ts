import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import Usuario from '@modules/users/infra/typeorm/entities/User';

@Entity('agendamentos')
class Agendamento {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  prestador_id: string;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'prestador_id' })
  prestador: Usuario;

  @Column('timestamp with time zone')
  data: Date;

  @Column()
  user_id: string;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'prestador_id' })
  user: Usuario;

  @CreateDateColumn()
  criado_em: Date;

  @UpdateDateColumn()
  atualizado_em: Date;
}

export default Agendamento;
