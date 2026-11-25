import { cls } from '../utils/helpers'

/** Consistent centered max-width container used by every page. */
export default function Container({ children, className, as: Tag = 'div' }) {
  return <Tag className={cls('container-x', className)}>{children}</Tag>
}
