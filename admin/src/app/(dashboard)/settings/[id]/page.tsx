'use client'

import { AdminHeader } from '@/components/ui/AdminHeader'
import GeneralSettings from '../components/system/GeneralSettings'
import SecuritySettings from '../components/system/SecuritySettings'
import FeatureToggles from '../components/system/FeatureToggles'
import MaintenanceMode from '../components/system/MaintenanceMode'
import StripeConfig from '../components/payment/StripeConfig'
import MpesaConfig from '../components/payment/MpesaConfig'
import CommissionSettings from '../components/payment/CommissionSettings'
import CurrencySettings from '../components/payment/CurrencySettings'
import TaxSettings from '../components/payment/TaxSettings'
import LanguageSettings from '../components/localization/LanguageSettings'
import TranslationManager from '../components/localization/TranslationManager'
import EmailTemplates from '../components/notifications/EmailTemplates'
import NotificationRules from '../components/notifications/NotificationRules'
import PushSettings from '../components/notifications/PushSettings'
import SMSSettings from '../components/notifications/SMSSettings'
import ThirdPartyIntegrations from '../components/integrations/ThirdPartyIntegrations'
import MapboxConfig from '../components/integrations/MapboxConfig'
import AWSConfig from '../components/integrations/AWSConfig'

const componentMap: Record<string, React.ComponentType> = {
  general: GeneralSettings,
  security: SecuritySettings,
  features: FeatureToggles,
  maintenance: MaintenanceMode,
  stripe: StripeConfig,
  mpesa: MpesaConfig,
  commission: CommissionSettings,
  currency: CurrencySettings,
  tax: TaxSettings,
  language: LanguageSettings,
  translations: TranslationManager,
  emails: EmailTemplates,
  notifications: NotificationRules,
  push: PushSettings,
  sms: SMSSettings,
  integrations: ThirdPartyIntegrations,
  mapbox: MapboxConfig,
  aws: AWSConfig,
}

export default function SettingsCategoryPage({ params }: { params: { id: string } }) {
  const Component = componentMap[params.id]

  if (!Component) {
    return (
      <div className="space-y-6">
        <AdminHeader title="Settings" description="Manage system configuration." />
        <div className="admin-card">
          <div className="admin-card-body text-center py-12 text-slate-500">
            Settings category not found.
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <AdminHeader title="Settings" description={`Manage ${params.id} configuration.`} />
      <Component />
    </div>
  )
}
