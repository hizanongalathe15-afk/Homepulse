'use client'

import { AdminHeader } from '@/components/ui/AdminHeader'
import GeneralSettings from './components/system/GeneralSettings'
import SecuritySettings from './components/system/SecuritySettings'
import FeatureToggles from './components/system/FeatureToggles'
import MaintenanceMode from './components/system/MaintenanceMode'
import StripeConfig from './components/payment/StripeConfig'
import MpesaConfig from './components/payment/MpesaConfig'
import CommissionSettings from './components/payment/CommissionSettings'
import CurrencySettings from './components/payment/CurrencySettings'
import TaxSettings from './components/payment/TaxSettings'
import LanguageSettings from './components/localization/LanguageSettings'
import TranslationManager from './components/localization/TranslationManager'
import EmailTemplates from './components/notifications/EmailTemplates'
import NotificationRules from './components/notifications/NotificationRules'
import PushSettings from './components/notifications/PushSettings'
import SMSSettings from './components/notifications/SMSSettings'
import ThirdPartyIntegrations from './components/integrations/ThirdPartyIntegrations'
import MapboxConfig from './components/integrations/MapboxConfig'
import AWSConfig from './components/integrations/AWSConfig'
import CookieSettings from './components/system/CookieSettings'

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <AdminHeader
        title="Settings"
        description="Manage system configuration, payments, notifications, and integrations."
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GeneralSettings />
        <SecuritySettings />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FeatureToggles />
        <MaintenanceMode />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StripeConfig />
        <MpesaConfig />
      </div>
      <CommissionSettings />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CurrencySettings />
        <TaxSettings />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LanguageSettings />
        <TranslationManager />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <EmailTemplates />
        <NotificationRules />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PushSettings />
        <SMSSettings />
      </div>
      <ThirdPartyIntegrations />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MapboxConfig />
        <AWSConfig />
      </div>
      <CookieSettings />
    </div>
  )
}
