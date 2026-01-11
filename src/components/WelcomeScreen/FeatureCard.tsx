interface FeatureCardProps {
  icon: string
  title: string
  description: string
}

export function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="bg-dark-card p-5 rounded-lg border border-gray-700">
      <h3 className="text-lg font-semibold mb-2 text-blue-400">
        {icon} {title}
      </h3>
      <p className="text-sm text-gray-400">{description}</p>
    </div>
  )
}
