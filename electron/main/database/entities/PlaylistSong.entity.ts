import { CreateDateColumn, Entity, PrimaryColumn } from 'typeorm'

@Entity()
export class PlaylistSong {
  @PrimaryColumn('int')
  playlistId: number

  @PrimaryColumn('int')
  songId: number

  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date

  // @Column('int', { default: 0 })
  // sort: number // 在播放列表中的排序位置
}
