import { User } from '../../user/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  ManyToMany,
} from 'typeorm';
import { RoleLevel, RoleEnum } from 'src/common/enums/index.enum';

@Entity('role')
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50, unique: true, comment: '角色名称' })
  name: RoleEnum;

  @Column({ type: 'smallint', comment: '角色等级' })
  level: RoleLevel;

  @Column({ type: 'varchar', length: 100, comment: '角色描述' })
  description: string;

  @ManyToMany(() => User, (user) => user.roles)
  users: User[];
}
