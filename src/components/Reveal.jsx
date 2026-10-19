import { useInView } from '../hooks/useInView';

/** Adds `is-visible` when scrolled into view; the animation itself is CSS (.reveal). */
export default function Reveal({ as: Tag = 'div', delay = 0, className = '', style, children, ...rest }) {
  const [ref, inView] = useInView({ threshold: 0.15 });
  return (
    <Tag
      ref={ref}
      className={`reveal ${inView ? 'is-visible' : ''} ${className}`}
      style={{ '--delay': `${delay}s`, ...style }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
