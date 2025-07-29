import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { Role } from 'src/system/roles/entities/role.entity';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn('uuid') // 主键，自动生成 UUID
  id: string;

  @Column({ type: 'varchar', length: 50, unique: true, comment: '用户名' })
  username: string;

  @Exclude()
  @Column({ type: 'varchar', length: 100, comment: '用户密码' })
  password: string;

  @Column({ type: 'varchar', length: 100, nullable: true, comment: '邮箱' })
  email?: string;

  @Column({ type: 'varchar', length: 100, nullable: true, comment: '性别' })
  sex?: string;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    comment: '创建时间',
  })
  createdAt: Date;

  @ManyToMany(() => Role, (role) => role.users)
  @JoinTable({ name: 'users_roles' })
  roles: Role[];
}
