interface FormItemProps {
  /** 歌曲ID */
  songId: number;
  /** 歌曲名称 */
  songName: string;
  /** 歌曲封面 */
  coverUrl?: string;
  /** 歌曲音频 */
  audioUrl?: string;
  /** 歌手名称 */
  artistName?: string;
  /** 已关联的情绪ID列表 */
  moodIds: number[];
}
 
interface FormProps {
  formInline: FormItemProps;
}
 
export type { FormItemProps, FormProps };
