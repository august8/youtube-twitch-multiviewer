interface FeatureCardProps {
  icon: string
  title: string
  description: string
}

export function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="bg-light-card dark:bg-dark-card p-5 rounded-lg border border-gray-300 dark:border-gray-700">
      <h3 className="text-lg font-semibold mb-2 text-blue-600 dark:text-blue-400">
        {icon} {title}
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
    </div>
  )
}
