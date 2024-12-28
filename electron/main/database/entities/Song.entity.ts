import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

@Entity()
export class Song {
  @PrimaryGeneratedColumn('increment')
  id: number

  @Column('varchar')
  title: string

  @Column('varchar')
  artist: string

  @Column('varchar')
  album: string

  @Column('float')
  duration: number

  @Column('varchar')
  path: string

  @Column('varchar', { nullable: true })
  cover?: string

  @Column('boolean', { default: false })
  isFavorite: boolean

  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date

  @UpdateDateColumn({ type: 'datetime' })
  updatedAt: Date
}
