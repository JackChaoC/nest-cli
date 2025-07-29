import { AppDataSource } from './data-source';
import { User } from 'src/system/user/entities/user.entity';

AppDataSource.initialize()
  .then(async () => {
    console.log('Database connection established');
    const res = await AppDataSource.manager.find(User);
    console.log(res);

  })
  .catch((error) => {
    console.error('Error establishing database connection:', error);
  });
