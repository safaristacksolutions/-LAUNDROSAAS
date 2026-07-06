import { ReactNode } from "react";
import clsx from "clsx";

interface CardProps {
  title?: string;
  subtitle?: string;
  icon?: string;
  children: ReactNode;
  className?: string;
  action?: ReactNode;
}

export function Card({ title, subtitle, icon, children, className, action }: CardProps) {
  return (
    <div className={clsx("bg-white rounded-2xl border border-gray-100 shadow-sm p-5", className)}>
      {(title || icon || action) && (
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {icon && <img src={icon} alt="" className="w-6 h-6" />}
            <div>
              {title && <h3 className="font-semibold text-gray-900">{title}</h3>}
              {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
            </div>
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
}
