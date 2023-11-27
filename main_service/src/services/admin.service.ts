import { Repository, DataSource} from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities';

export class AdminService {
    constructor(
        private dataSource: DataSource,
        @InjectRepository(User)
        private readonly user : Repository<User>
    ){}
    
    async create_SuperAdmin_Or_Admin(body: any){
        
    }
}