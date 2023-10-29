import { Bucket } from 'src/bucket/entities/bucket.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'object' })
export class ObjectEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  key: string;

  @Column({ nullable: false })
  size: number;

  @Column({ nullable: false })
  mimetype: string;

  @ManyToOne(() => Bucket, (bucket) => bucket.objects)
  bucket: Bucket;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
