import { Column, Entity, PrimaryColumn } from 'typeorm'

@Entity()
export class PlayHistory {
  // @PrimaryGeneratedColumn('increment')
  // id: number

  // @Column('int')
  @PrimaryColumn('int')
  songId: number

  // @UpdateDateColumn({ type: 'datetime' })
  @Column('datetime')
  playedAt: Date // 播放时间
}
