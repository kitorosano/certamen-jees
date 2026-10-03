export type Action = {
  label: string;
  className: string;
  disabled?: boolean;
  icon?: string;
  onClick: () => void;
};

type Props = {
  title: string;
  ariaLabel: string;
  className: string;
  actionsClassName?: string;
  actions: Action[];
};

export default function ActionSection({
  title,
  ariaLabel,
  className,
  actionsClassName = "actions",
  actions,
}: Props) {
  return (
    <section className={className} aria-label={ariaLabel}>
      <p className="section-label">{title}</p>
      <div className={actionsClassName}>
        {actions.map((action) => (
          <button
            type="button"
            className={action.className}
            disabled={action.disabled}
            onClick={action.onClick}
            key={action.label}
          >
            {action.icon && <span aria-hidden="true">{action.icon}</span>}
            {action.label}
          </button>
        ))}
      </div>
    </section>
  );
}
