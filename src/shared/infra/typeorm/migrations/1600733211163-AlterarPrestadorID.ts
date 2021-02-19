import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export default class AlterarPrestadorID1600733211163
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('agendamentos', 'prestador');
    await queryRunner.addColumn(
      'agendamentos',
      new TableColumn({
        name: 'prestador_id',
        type: 'uuid',
        isNullable: true,
      })
    );

    await queryRunner.createForeignKey(
      'agendamentos',
      new TableForeignKey({
        name: 'AgendamentoPrestador',
        columnNames: ['prestador_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'usuarios',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('agendamentos', 'AgendamentoPrestador');
    await queryRunner.dropColumn('agendamentos', 'prestador_id');
    await queryRunner.addColumn(
      'agendamentos',
      new TableColumn({
        name: 'prestador',
        type: 'varchar',
      })
    );
  }
}
