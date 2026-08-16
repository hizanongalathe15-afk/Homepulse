.
|-- admin
|   |-- .env
|   |-- next.config.js
|   |-- package.json
|   |-- postcss.config.js
|   |-- public
|   |   |-- fonts
|   |   |   `-- .gitkeep
|   |   |-- icons
|   |   |   `-- .gitkeep
|   |   `-- images
|   |       `-- .gitkeep
|   |-- src
|   |   |-- app
|   |   |   |-- (auth)
|   |   |   |   |-- 2fa
|   |   |   |   |   `-- page.tsx
|   |   |   |   |-- forgot-password
|   |   |   |   |   `-- page.tsx
|   |   |   |   |-- layout.tsx
|   |   |   |   |-- login
|   |   |   |   |   `-- page.tsx
|   |   |   |   `-- register
|   |   |   |       `-- page.tsx
|   |   |   |-- (dashboard)
|   |   |   |   |-- analytics
|   |   |   |   |   |-- components
|   |   |   |   |   |   |-- campaign-analytics
|   |   |   |   |   |   |   |-- CampaignMetrics.tsx
|   |   |   |   |   |   |   |-- CampaignSuccessRate.tsx
|   |   |   |   |   |   |   `-- TrendingCampaigns.tsx
|   |   |   |   |   |   |-- property-analytics
|   |   |   |   |   |   |   |-- CityHeatmap.tsx
|   |   |   |   |   |   |   |-- NeighborhoodAnalytics.tsx
|   |   |   |   |   |   |   |-- OccupancyRates.tsx
|   |   |   |   |   |   |   |-- PriceTrends.tsx
|   |   |   |   |   |   |   `-- PropertyMetrics.tsx
|   |   |   |   |   |   |-- qr-analytics
|   |   |   |   |   |   |   |-- QRConversionRate.tsx
|   |   |   |   |   |   |   |-- QRPerformance.tsx
|   |   |   |   |   |   |   |-- QRScanHeatmap.tsx
|   |   |   |   |   |   |   `-- QRScanMetrics.tsx
|   |   |   |   |   |   |-- revenue-analytics
|   |   |   |   |   |   |   |-- CommissionTracker.tsx
|   |   |   |   |   |   |   |-- PaymentMethodBreakdown.tsx
|   |   |   |   |   |   |   |-- RevenueByCity.tsx
|   |   |   |   |   |   |   |-- RevenueChart.tsx
|   |   |   |   |   |   |   `-- RevenueForecast.tsx
|   |   |   |   |   |   |-- safety-analytics
|   |   |   |   |   |   |   |-- IncidentMetrics.tsx
|   |   |   |   |   |   |   |-- SafetyScoreTrends.tsx
|   |   |   |   |   |   |   `-- SOSAlertTrends.tsx
|   |   |   |   |   |   `-- user-analytics
|   |   |   |   |   |       |-- DemographicsChart.tsx
|   |   |   |   |   |       |-- UserJourneyMap.tsx
|   |   |   |   |   |       |-- UserMetrics.tsx
|   |   |   |   |   |       |-- UserRetentionChart.tsx
|   |   |   |   |   |       `-- UserSegmentation.tsx
|   |   |   |   |   `-- page.tsx
|   |   |   |   |-- audit-logs
|   |   |   |   |   |-- components
|   |   |   |   |   |   |-- AuditLogAnalytics.tsx
|   |   |   |   |   |   |-- AuditLogExport.tsx
|   |   |   |   |   |   |-- AuditLogFilters.tsx
|   |   |   |   |   |   `-- AuditLogTable.tsx
|   |   |   |   |   `-- page.tsx
|   |   |   |   |-- banner-management
|   |   |   |   |   |-- components
|   |   |   |   |   |   |-- BannerABTesting.tsx
|   |   |   |   |   |   |-- BannerAnalytics.tsx
|   |   |   |   |   |   |-- BannerCreator.tsx
|   |   |   |   |   |   |-- BannerList.tsx
|   |   |   |   |   |   |-- BannerPerformance.tsx
|   |   |   |   |   |   |-- BannerPlacementManager.tsx
|   |   |   |   |   |   |-- BannerScheduler.tsx
|   |   |   |   |   |   |-- BannerTargeting.tsx
|   |   |   |   |   |   `-- BannerTemplates.tsx
|   |   |   |   |   |-- [id]
|   |   |   |   |   |   `-- page.tsx
|   |   |   |   |   `-- page.tsx
|   |   |   |   |-- campaigns
|   |   |   |   |   |-- components
|   |   |   |   |   |   |-- CampaignAnalytics.tsx
|   |   |   |   |   |   |-- CampaignFilters.tsx
|   |   |   |   |   |   |-- CampaignFlagModal.tsx
|   |   |   |   |   |   |-- CampaignList.tsx
|   |   |   |   |   |   |-- CampaignResolutionModal.tsx
|   |   |   |   |   |   `-- CampaignResolution.tsx
|   |   |   |   |   |-- [id]
|   |   |   |   |   |   `-- page.tsx
|   |   |   |   |   `-- page.tsx
|   |   |   |   |-- content-management
|   |   |   |   |   |-- announcements
|   |   |   |   |   |   |-- components
|   |   |   |   |   |   |   |-- AnnouncementCreator.tsx
|   |   |   |   |   |   |   |-- AnnouncementList.tsx
|   |   |   |   |   |   |   `-- AnnouncementTargeting.tsx
|   |   |   |   |   |   |-- [id]
|   |   |   |   |   |   |   `-- page.tsx
|   |   |   |   |   |   `-- page.tsx
|   |   |   |   |   |-- blog
|   |   |   |   |   |   |-- components
|   |   |   |   |   |   |   |-- BlogCategories.tsx
|   |   |   |   |   |   |   |-- BlogEditor.tsx
|   |   |   |   |   |   |   |-- BlogList.tsx
|   |   |   |   |   |   |   |-- BlogSEO.tsx
|   |   |   |   |   |   |   `-- BlogTags.tsx
|   |   |   |   |   |   |-- [id]
|   |   |   |   |   |   |   `-- page.tsx
|   |   |   |   |   |   `-- page.tsx
|   |   |   |   |   |-- faq
|   |   |   |   |   |   |-- components
|   |   |   |   |   |   |   |-- FAQCategories.tsx
|   |   |   |   |   |   |   |-- FAQManager.tsx
|   |   |   |   |   |   |   `-- FAQOrdering.tsx
|   |   |   |   |   |   `-- page.tsx
|   |   |   |   |   `-- tutorials
|   |   |   |   |       |-- components
|   |   |   |   |       |   |-- TutorialCategories.tsx
|   |   |   |   |       |   |-- TutorialCreator.tsx
|   |   |   |   |       |   `-- TutorialList.tsx
|   |   |   |   |       `-- page.tsx
|   |   |   |   |-- disputes
|   |   |   |   |   |-- components
|   |   |   |   |   |   |-- DisputeAnalytics.tsx
|   |   |   |   |   |   |-- DisputeFilters.tsx
|   |   |   |   |   |   |-- DisputeResolutionModal.tsx
|   |   |   |   |   |   |-- DisputeTable.tsx
|   |   |   |   |   |   |-- EscrowActionButtons.tsx
|   |   |   |   |   |   |-- EvidenceViewer.tsx
|   |   |   |   |   |   `-- MediationChat.tsx
|   |   |   |   |   |-- [id]
|   |   |   |   |   |   `-- page.tsx
|   |   |   |   |   |-- page.tsx
|   |   |   |   |   `-- types
|   |   |   |   |       |-- dispute.constants.ts
|   |   |   |   |       `-- dispute.types.ts
|   |   |   |   |-- escrow-management
|   |   |   |   |   |-- components
|   |   |   |   |   |   |-- EscrowAnalytics.tsx
|   |   |   |   |   |   |-- EscrowAuditTrail.tsx
|   |   |   |   |   |   |-- EscrowAutoRelease.tsx
|   |   |   |   |   |   |-- EscrowDisputes.tsx
|   |   |   |   |   |   |-- EscrowManualOverride.tsx
|   |   |   |   |   |   |-- EscrowOverview.tsx
|   |   |   |   |   |   `-- EscrowTransactions.tsx
|   |   |   |   |   |-- [id]
|   |   |   |   |   |   `-- page.tsx
|   |   |   |   |   `-- page.tsx
|   |   |   |   |-- feedback
|   |   |   |   |   |-- components
|   |   |   |   |   |   |-- FeedbackAnalytics.tsx
|   |   |   |   |   |   |-- FeedbackFilters.tsx
|   |   |   |   |   |   |-- FeedbackList.tsx
|   |   |   |   |   |   `-- FeedbackResponse.tsx
|   |   |   |   |   `-- page.tsx
|   |   |   |   |-- fraud-detection
|   |   |   |   |   |-- components
|   |   |   |   |   |   |-- FraudAlerts.tsx
|   |   |   |   |   |   |-- FraudAnalytics.tsx
|   |   |   |   |   |   |-- FraudFlaggedListings.tsx
|   |   |   |   |   |   |-- FraudManualReview.tsx
|   |   |   |   |   |   `-- FraudRules.tsx
|   |   |   |   |   `-- page.tsx
|   |   |   |   |-- notifications
|   |   |   |   |   |-- components
|   |   |   |   |   |   |-- NotificationAnalytics.tsx
|   |   |   |   |   |   |-- NotificationCreator.tsx
|   |   |   |   |   |   |-- NotificationHistory.tsx
|   |   |   |   |   |   |-- NotificationScheduler.tsx
|   |   |   |   |   |   |-- NotificationSegments.tsx
|   |   |   |   |   |   `-- NotificationTemplates.tsx
|   |   |   |   |   |-- [id]
|   |   |   |   |   |   `-- page.tsx
|   |   |   |   |   `-- page.tsx
|   |   |   |   |-- overview
|   |   |   |   |   |-- components
|   |   |   |   |   |   |-- QuickActions.tsx
|   |   |   |   |   |   |-- RecentActivityFeed.tsx
|   |   |   |   |   |   |-- RevenueChart.tsx
|   |   |   |   |   |   |-- StatsGrid.tsx
|   |   |   |   |   |   |-- SystemHealth.tsx
|   |   |   |   |   |   |-- TopPerformingProperties.tsx
|   |   |   |   |   |   `-- UserGrowthChart.tsx
|   |   |   |   |   `-- page.tsx
|   |   |   |   |-- payments
|   |   |   |   |   |-- components
|   |   |   |   |   |   |-- MpesaTransactions.tsx
|   |   |   |   |   |   |-- PaymentAnalytics.tsx
|   |   |   |   |   |   |-- PaymentDisputeModal.tsx
|   |   |   |   |   |   |-- PaymentFilters.tsx
|   |   |   |   |   |   |-- PaymentReconciliation.tsx
|   |   |   |   |   |   |-- PaymentRefundModal.tsx
|   |   |   |   |   |   |-- PaymentTable.tsx
|   |   |   |   |   |   `-- StripeTransactions.tsx
|   |   |   |   |   |-- [id]
|   |   |   |   |   |   `-- page.tsx
|   |   |   |   |   `-- page.tsx
|   |   |   |   |-- properties
|   |   |   |   |   |-- categories
|   |   |   |   |   |   |-- components
|   |   |   |   |   |   |   |-- AttributeManager.tsx
|   |   |   |   |   |   |   |-- CategoryManager.tsx
|   |   |   |   |   |   |   `-- SubcategoryManager.tsx
|   |   |   |   |   |   `-- page.tsx
|   |   |   |   |   |-- components
|   |   |   |   |   |   |-- PropertyApprovalQueue.tsx
|   |   |   |   |   |   |-- PropertyBulkActions.tsx
|   |   |   |   |   |   |-- PropertyDeleteModal.tsx
|   |   |   |   |   |   |-- PropertyDetailCard.tsx
|   |   |   |   |   |   |-- PropertyFilters.tsx
|   |   |   |   |   |   |-- PropertyFlagModal.tsx
|   |   |   |   |   |   |-- PropertyImagesManager.tsx
|   |   |   |   |   |   |-- PropertyTable.tsx
|   |   |   |   |   |   `-- PropertyVerificationModal.tsx
|   |   |   |   |   |-- [id]
|   |   |   |   |   |   `-- page.tsx
|   |   |   |   |   `-- page.tsx
|   |   |   |   |-- qr-management
|   |   |   |   |   |-- components
|   |   |   |   |   |   |-- QRAnalytics.tsx
|   |   |   |   |   |   |-- QRBulkGenerator.tsx
|   |   |   |   |   |   |-- QRCampaigns.tsx
|   |   |   |   |   |   |-- QRExpiryManager.tsx
|   |   |   |   |   |   |-- QRGenerator.tsx
|   |   |   |   |   |   |-- QRList.tsx
|   |   |   |   |   |   |-- QRPrintManager.tsx
|   |   |   |   |   |   |-- QRScanner.tsx
|   |   |   |   |   |   |-- QRScheduler.tsx
|   |   |   |   |   |   `-- QRTemplates.tsx
|   |   |   |   |   |-- [id]
|   |   |   |   |   |   `-- page.tsx
|   |   |   |   |   `-- page.tsx
|   |   |   |   |-- reports
|   |   |   |   |   |-- components
|   |   |   |   |   |   |-- CustomMetricsBuilder.tsx
|   |   |   |   |   |   |-- ReportAnalytics.tsx
|   |   |   |   |   |   |-- ReportBuilder.tsx
|   |   |   |   |   |   |-- ReportExporter.tsx
|   |   |   |   |   |   |-- ReportScheduler.tsx
|   |   |   |   |   |   |-- ReportSharing.tsx
|   |   |   |   |   |   `-- ReportTemplates.tsx
|   |   |   |   |   |-- [id]
|   |   |   |   |   |   `-- page.tsx
|   |   |   |   |   `-- page.tsx
|   |   |   |   |-- safety
|   |   |   |   |   |-- components
|   |   |   |   |   |   |-- EmergencyContactManager.tsx
|   |   |   |   |   |   |-- IncidentReportManager.tsx
|   |   |   |   |   |   |-- SafetyAnalytics.tsx
|   |   |   |   |   |   |-- SafetyScoreManager.tsx
|   |   |   |   |   |   `-- SOSAlertDashboard.tsx
|   |   |   |   |   |-- [id]
|   |   |   |   |   |   `-- page.tsx
|   |   |   |   |   `-- page.tsx
|   |   |   |   |-- settings
|   |   |   |   |   |-- components
|   |   |   |   |   |   |-- integrations
|   |   |   |   |   |   |   |-- AWSConfig.tsx
|   |   |   |   |   |   |   |-- MapboxConfig.tsx
|   |   |   |   |   |   |   `-- ThirdPartyIntegrations.tsx
|   |   |   |   |   |   |-- localization
|   |   |   |   |   |   |   |-- LanguageSettings.tsx
|   |   |   |   |   |   |   `-- TranslationManager.tsx
|   |   |   |   |   |   |-- notifications
|   |   |   |   |   |   |   |-- EmailTemplates.tsx
|   |   |   |   |   |   |   |-- NotificationRules.tsx
|   |   |   |   |   |   |   |-- PushSettings.tsx
|   |   |   |   |   |   |   `-- SMSSettings.tsx
|   |   |   |   |   |   |-- payment
|   |   |   |   |   |   |   |-- CommissionSettings.tsx
|   |   |   |   |   |   |   |-- CurrencySettings.tsx
|   |   |   |   |   |   |   |-- MpesaConfig.tsx
|   |   |   |   |   |   |   |-- StripeConfig.tsx
|   |   |   |   |   |   |   `-- TaxSettings.tsx
|   |   |   |   |   |   `-- system
|   |   |   |   |   |       |-- FeatureToggles.tsx
|   |   |   |   |   |       |-- GeneralSettings.tsx
|   |   |   |   |   |       |-- MaintenanceMode.tsx
|   |   |   |   |   |       `-- SecuritySettings.tsx
|   |   |   |   |   |-- [id]
|   |   |   |   |   |   `-- page.tsx
|   |   |   |   |   `-- page.tsx
|   |   |   |   |-- support
|   |   |   |   |   |-- components
|   |   |   |   |   |   |-- LiveChat.tsx
|   |   |   |   |   |   |-- SupportAnalytics.tsx
|   |   |   |   |   |   |-- SupportTickets.tsx
|   |   |   |   |   |   `-- TicketDetail.tsx
|   |   |   |   |   `-- page.tsx
|   |   |   |   |-- users
|   |   |   |   |   |-- components
|   |   |   |   |   |   |-- UserActivityLog.tsx
|   |   |   |   |   |   |-- UserBulkActions.tsx
|   |   |   |   |   |   |-- UserExport.tsx
|   |   |   |   |   |   |-- UserFilters.tsx
|   |   |   |   |   |   |-- UserProfileCard.tsx
|   |   |   |   |   |   |-- UserRoleChanger.tsx
|   |   |   |   |   |   |-- UserSuspendModal.tsx
|   |   |   |   |   |   |-- UserTable.tsx
|   |   |   |   |   |   `-- UserVerificationStatus.tsx
|   |   |   |   |   |-- [id]
|   |   |   |   |   |   `-- page.tsx
|   |   |   |   |   |-- page.tsx
|   |   |   |   |   `-- segments
|   |   |   |   |       |-- components
|   |   |   |   |       |   |-- SegmentActions.tsx
|   |   |   |   |       |   |-- SegmentBuilder.tsx
|   |   |   |   |       |   `-- SegmentPreview.tsx
|   |   |   |   |       `-- page.tsx
|   |   |   |   `-- verifications
|   |   |   |       |-- components
|   |   |   |       |   |-- BackgroundCheck.tsx
|   |   |   |       |   |-- DocumentVerification.tsx
|   |   |   |       |   |-- IdentityVerification.tsx
|   |   |   |       |   |-- VerificationHistory.tsx
|   |   |   |       |   |-- VerificationQueue.tsx
|   |   |   |       |   `-- VerificationStats.tsx
|   |   |   |       |-- [id]
|   |   |   |       |   `-- page.tsx
|   |   |   |       `-- page.tsx
|   |   |   `-- layout.tsx
|   |   |-- components
|   |   |   |-- charts
|   |   |   |   |-- BarChart.tsx
|   |   |   |   |-- FunnelChart.tsx
|   |   |   |   |-- Heatmap.tsx
|   |   |   |   |-- LineChart.tsx
|   |   |   |   |-- PieChart.tsx
|   |   |   |   `-- RadarChart.tsx
|   |   |   |-- forms
|   |   |   |   |-- FormBuilder.tsx
|   |   |   |   |-- FormField.tsx
|   |   |   |   |-- FormValidation.tsx
|   |   |   |   `-- FormWizard.tsx
|   |   |   |-- layouts
|   |   |   |   |-- AdminLayout.tsx
|   |   |   |   |-- AuthLayout.tsx
|   |   |   |   `-- DashboardLayout.tsx
|   |   |   `-- ui
|   |   |       |-- AdminBreadcrumbs.tsx
|   |   |       |-- AdminButton.tsx
|   |   |       |-- AdminHeader.tsx
|   |   |       |-- AdminInput.tsx
|   |   |       |-- AdminModal.tsx
|   |   |       |-- AdminSidebar.tsx
|   |   |       |-- AdminTable.tsx
|   |   |       |-- DataTable.tsx
|   |   |       |-- EmptyState.tsx
|   |   |       |-- LoadingSkeleton.tsx
|   |   |       `-- StatusBadge.tsx
|   |   |-- contexts
|   |   |   |-- AdminAuthContext.tsx
|   |   |   |-- AdminAuthProvider.tsx
|   |   |   |-- AdminNotificationContext.tsx
|   |   |   |-- AdminPermissionContext.tsx
|   |   |   |-- AdminSocketContext.tsx
|   |   |   `-- AdminThemeContext.tsx
|   |   |-- hooks
|   |   |   |-- useAdminAuth.ts
|   |   |   |-- useAdminData.ts
|   |   |   |-- useAdminExport.ts
|   |   |   |-- useAdminFilters.ts
|   |   |   |-- useAdminPagination.ts
|   |   |   |-- useAdminPermissions.ts
|   |   |   |-- useAnalytics.ts
|   |   |   `-- useWebSocket.ts
|   |   |-- lib
|   |   |   |-- apiClient.ts
|   |   |   `-- utils.ts
|   |   |-- middleware
|   |   |   |-- adminAuth.middleware.ts
|   |   |   |-- adminPermissions.ts
|   |   |   |-- adminRateLimiter.ts
|   |   |   `-- adminSecurity.ts
|   |   |-- services
|   |   |   |-- adminAnalytics.service.ts
|   |   |   |-- adminAudit.service.ts
|   |   |   |-- adminAuth.service.ts
|   |   |   |-- adminBanner.service.ts
|   |   |   |-- adminCampaign.service.ts
|   |   |   |-- adminContent.service.ts
|   |   |   |-- adminDispute.service.ts
|   |   |   |-- adminEscrow.service.ts
|   |   |   |-- adminExport.service.ts
|   |   |   |-- adminFraud.service.ts
|   |   |   |-- adminPayment.service.ts
|   |   |   |-- adminProperty.service.ts
|   |   |   |-- adminQR.service.ts
|   |   |   |-- adminReport.service.ts
|   |   |   |-- adminSafety.service.ts
|   |   |   |-- adminSettings.service.ts
|   |   |   |-- adminUser.service.ts
|   |   |   `-- adminVerification.service.ts
|   |   |-- styles
|   |   |   |-- admin.css
|   |   |   |-- charts.css
|   |   |   `-- globals.css
|   |   |-- types
|   |   |   |-- admin.types.ts
|   |   |   |-- analytics.types.ts
|   |   |   |-- banner.types.ts
|   |   |   |-- dispute.types.ts
|   |   |   |-- payment.types.ts
|   |   |   |-- property.types.ts
|   |   |   |-- qr.types.ts
|   |   |   |-- report.types.ts
|   |   |   `-- user.types.ts
|   |   `-- utils
|   |       |-- admin.constants.ts
|   |       |-- admin.formatters.ts
|   |       |-- admin.helpers.ts
|   |       |-- admin.metrics.ts
|   |       |-- admin.permissions.ts
|   |       `-- admin.validators.ts
|   |-- tailwind.config.js
|   `-- tsconfig.json
|-- app
|   |-- analysis_options.yaml
|   |-- assets
|   |   |-- icons
|   |   |-- images
|   |   |-- qr_templates
|   |   `-- videos
|   |-- lib
|   |   |-- app.dart
|   |   |-- core
|   |   |   |-- config
|   |   |   |   |-- constants.dart
|   |   |   |   |-- env.dart
|   |   |   |   |-- mapbox_config.dart
|   |   |   |   `-- mpesa_config.dart
|   |   |   |-- l10n
|   |   |   |   |-- app_en.arb
|   |   |   |   `-- app_sw.arb
|   |   |   |-- network
|   |   |   |   |-- api_client.dart
|   |   |   |   |-- api_exception.dart
|   |   |   |   `-- socket_client.dart
|   |   |   |-- routing
|   |   |   |   `-- app_router.dart
|   |   |   |-- theme
|   |   |   |   |-- app_colors.dart
|   |   |   |   `-- app_theme.dart
|   |   |   `-- utils
|   |   |       |-- formatters.dart
|   |   |       |-- location_utils.dart
|   |   |       |-- qr_generator.dart
|   |   |       `-- validators.dart
|   |   |-- features
|   |   |   |-- auth
|   |   |   |   `-- screens
|   |   |   |       |-- forgot_password_screen.dart
|   |   |   |       |-- login_screen.dart
|   |   |   |       |-- register_screen.dart
|   |   |   |       |-- verify_id_screen.dart
|   |   |   |       `-- verify_otp_screen.dart
|   |   |   |-- community
|   |   |   |   `-- screens
|   |   |   |       |-- community_screen.dart
|   |   |   |       |-- neighborhood_screen.dart
|   |   |   |       `-- widgets
|   |   |   |           |-- community_chat.dart
|   |   |   |           |-- community_groups.dart
|   |   |   |           |-- local_events.dart
|   |   |   |           |-- neighbor_feed.dart
|   |   |   |           |-- neighborhood_qr.dart
|   |   |   |           `-- people_you_may_know.dart
|   |   |   |-- dashboard
|   |   |   |   `-- screens
|   |   |   |       |-- dashboard_screen.dart
|   |   |   |       `-- widgets
|   |   |   |           |-- escrow_status.dart
|   |   |   |           |-- my_qr_code.dart
|   |   |   |           |-- payment_history.dart
|   |   |   |           |-- qr_scanner_tile.dart
|   |   |   |           |-- referral_panel.dart
|   |   |   |           |-- renter_resume.dart
|   |   |   |           |-- saved_properties.dart
|   |   |   |           |-- saved_searches.dart
|   |   |   |           |-- smart_calendar.dart
|   |   |   |           `-- viewing_requests.dart
|   |   |   |-- feed
|   |   |   |   `-- screens
|   |   |   |       |-- feed_screen.dart
|   |   |   |       `-- widgets
|   |   |   |           |-- trust_badge_overlay.dart
|   |   |   |           |-- video_actions.dart
|   |   |   |           |-- video_card.dart
|   |   |   |           |-- video_comments.dart
|   |   |   |           |-- video_filters.dart
|   |   |   |           `-- video_skeleton.dart
|   |   |   |-- landlord
|   |   |   |   `-- screens
|   |   |   |       |-- landlord_home_screen.dart
|   |   |   |       `-- widgets
|   |   |   |           |-- add_property.dart
|   |   |   |           |-- bulk_qr_upload.dart
|   |   |   |           |-- escrow_manager.dart
|   |   |   |           |-- property_manager.dart
|   |   |   |           |-- qr_code_generator.dart
|   |   |   |           |-- revenue_analytics.dart
|   |   |   |           |-- tenant_requests.dart
|   |   |   |           `-- verification_status.dart
|   |   |   |-- map
|   |   |   |   `-- screens
|   |   |   |       |-- map_screen.dart
|   |   |   |       `-- widgets
|   |   |   |           |-- filter_bar.dart
|   |   |   |           |-- neighborhood_boundary.dart
|   |   |   |           |-- property_card.dart
|   |   |   |           |-- property_pin.dart
|   |   |   |           |-- safety_score_overlay.dart
|   |   |   |           `-- weather_overlay.dart
|   |   |   |-- messages
|   |   |   |   `-- screens
|   |   |   |       |-- chat_screen.dart
|   |   |   |       |-- messages_screen.dart
|   |   |   |       `-- widgets
|   |   |   |           |-- chat_window.dart
|   |   |   |           |-- negotiation_panel.dart
|   |   |   |           |-- qr_share.dart
|   |   |   |           |-- typing_indicator.dart
|   |   |   |           |-- video_pre_call_verify.dart
|   |   |   |           `-- voice_call.dart
|   |   |   |-- payments
|   |   |   |   `-- screens
|   |   |   |       |-- payments_screen.dart
|   |   |   |       `-- widgets
|   |   |   |           |-- escrow_deposit_flow.dart
|   |   |   |           |-- invoice_generator.dart
|   |   |   |           |-- mpesa_payment.dart
|   |   |   |           |-- payment_history.dart
|   |   |   |           |-- qr_code_payment.dart
|   |   |   |           `-- stripe_payment.dart
|   |   |   |-- profile
|   |   |   |   `-- screens
|   |   |   |       `-- profile_screen.dart
|   |   |   |-- property_detail
|   |   |   |   `-- screens
|   |   |   |       |-- property_detail_screen.dart
|   |   |   |       `-- widgets
|   |   |   |           |-- campaign_section.dart
|   |   |   |           |-- landlord_profile.dart
|   |   |   |           |-- lease_snapshot.dart
|   |   |   |           |-- neighborhood_info.dart
|   |   |   |           |-- property_gallery.dart
|   |   |   |           |-- property_qr_code.dart
|   |   |   |           |-- qna_section.dart
|   |   |   |           |-- rent_negotiation.dart
|   |   |   |           |-- safety_report_section.dart
|   |   |   |           |-- sos_button.dart
|   |   |   |           |-- trust_score_badge.dart
|   |   |   |           |-- viewing_booking.dart
|   |   |   |           `-- virtual_tour.dart
|   |   |   |-- qr_scanner
|   |   |   |   `-- screens
|   |   |   |       |-- scanner_screen.dart
|   |   |   |       `-- widgets
|   |   |   |           |-- scan_history.dart
|   |   |   |           `-- scan_result.dart
|   |   |   |-- roommates
|   |   |   |   `-- screens
|   |   |   |       |-- roommates_screen.dart
|   |   |   |       `-- widgets
|   |   |   |           |-- compatibility_quiz.dart
|   |   |   |           |-- match_card.dart
|   |   |   |           `-- match_chat_button.dart
|   |   |   `-- search
|   |   |       `-- screens
|   |   |           |-- search_screen.dart
|   |   |           `-- widgets
|   |   |               |-- saved_search_list.dart
|   |   |               |-- search_alerts_toggle.dart
|   |   |               `-- search_bar.dart
|   |   |-- main.dart
|   |   |-- models
|   |   |   |-- analytics_snapshot.dart
|   |   |   |-- banner.dart
|   |   |   |-- campaign.dart
|   |   |   |-- chat_message.dart
|   |   |   |-- escrow.dart
|   |   |   |-- identity_verification.dart
|   |   |   |-- lease.dart
|   |   |   |-- maintenance_request.dart
|   |   |   |-- neighborhood.dart
|   |   |   |-- notification.dart
|   |   |   |-- payment.dart
|   |   |   |-- property.dart
|   |   |   |-- qr_code.dart
|   |   |   |-- referral.dart
|   |   |   |-- review.dart
|   |   |   |-- roommate_profile.dart
|   |   |   |-- safety_report.dart
|   |   |   |-- saved_search.dart
|   |   |   |-- sos_alert.dart
|   |   |   `-- user.dart
|   |   |-- services
|   |   |   |-- analytics_service.dart
|   |   |   |-- auth_service.dart
|   |   |   |-- banner_service.dart
|   |   |   |-- chat_service.dart
|   |   |   |-- community_service.dart
|   |   |   |-- escrow_service.dart
|   |   |   |-- feed_service.dart
|   |   |   |-- id_verification_service.dart
|   |   |   |-- map_service.dart
|   |   |   |-- notification_service.dart
|   |   |   |-- payment_service.dart
|   |   |   |-- property_service.dart
|   |   |   |-- qr_service.dart
|   |   |   |-- referral_service.dart
|   |   |   |-- roommate_service.dart
|   |   |   |-- safety_service.dart
|   |   |   `-- search_service.dart
|   |   |-- state
|   |   |   |-- auth_provider.dart
|   |   |   |-- chat_provider.dart
|   |   |   |-- feed_provider.dart
|   |   |   |-- locale_provider.dart
|   |   |   |-- map_provider.dart
|   |   |   |-- notification_provider.dart
|   |   |   |-- qr_provider.dart
|   |   |   `-- search_provider.dart
|   |   `-- widgets
|   |       |-- app_button.dart
|   |       |-- app_card.dart
|   |       |-- app_dropdown.dart
|   |       |-- app_input.dart
|   |       |-- app_modal.dart
|   |       |-- app_skeleton.dart
|   |       |-- app_toast.dart
|   |       |-- banner_display.dart
|   |       |-- loading_spinner.dart
|   |       |-- qr_code_display.dart
|   |       |-- rating_stars.dart
|   |       |-- social_share.dart
|   |       |-- user_avatar.dart
|   |       `-- verified_badge.dart
|   |-- pubspec.yaml
|   `-- test
|       |-- integration
|       |-- unit
|       `-- widget
|-- backend
|   |-- Dockerfile
|   |-- .env
|   |-- .env.staging
|   |-- package.json
|   |-- prisma
|   |   |-- migrations
|   |   |-- schema.prisma
|   |   `-- seed.ts
|   |-- src
|   |   |-- app.ts
|   |   |-- config
|   |   |   |-- aws.config.ts
|   |   |   |-- database.config.ts
|   |   |   |-- logger.config.ts
|   |   |   |-- mpesa.config.ts
|   |   |   |-- push.config.ts
|   |   |   |-- qr.config.ts
|   |   |   |-- redis.config.ts
|   |   |   |-- search.config.ts
|   |   |   |-- sentry.config.ts
|   |   |   |-- sms.config.ts
|   |   |   |-- socket.config.ts
|   |   |   `-- stripe.config.ts
|   |   |-- controllers
|   |   |   |-- admin.controller.ts
|   |   |   |-- analytics.controller.ts
|   |   |   |-- auth.controller.ts
|   |   |   |-- banner.controller.ts
|   |   |   |-- campaign.controller.ts
|   |   |   |-- chat.controller.ts
|   |   |   |-- community.controller.ts
|   |   |   |-- escrow.controller.ts
|   |   |   |-- maintenance.controller.ts
|   |   |   |-- notification.controller.ts
|   |   |   |-- payment.controller.ts
|   |   |   |-- property.controller.ts
|   |   |   |-- qr.controller.ts
|   |   |   |-- referral.controller.ts
|   |   |   |-- review.controller.ts
|   |   |   |-- roommate.controller.ts
|   |   |   |-- safety.controller.ts
|   |   |   `-- search.controller.ts
|   |   |-- jobs
|   |   |   |-- bannerScheduler.job.ts
|   |   |   |-- expireListings.job.ts
|   |   |   |-- expireQRCodes.job.ts
|   |   |   |-- generateAnalytics.job.ts
|   |   |   |-- reindexSearch.job.ts
|   |   |   |-- releaseEscrow.job.ts
|   |   |   |-- sendReminders.job.ts
|   |   |   |-- sendSavedSearchAlerts.job.ts
|   |   |   `-- updateScores.job.ts
|   |   |-- middleware
|   |   |   |-- auth.middleware.ts
|   |   |   |-- errorHandler.middleware.ts
|   |   |   |-- logger.middleware.ts
|   |   |   |-- rateLimiter.middleware.ts
|   |   |   |-- role.middleware.ts
|   |   |   `-- validation.middleware.ts
|   |   |-- models
|   |   |   |-- Admin.model.ts
|   |   |   |-- Analytics.model.ts
|   |   |   |-- Banner.model.ts
|   |   |   |-- Campaign.model.ts
|   |   |   |-- Chat.model.ts
|   |   |   |-- Escrow.model.ts
|   |   |   |-- IdentityVerification.model.ts
|   |   |   |-- Lease.model.ts
|   |   |   |-- Maintenance.model.ts
|   |   |   |-- Neighborhood.model.ts
|   |   |   |-- Notification.model.ts
|   |   |   |-- Payment.model.ts
|   |   |   |-- Property.model.ts
|   |   |   |-- QRCode.model.ts
|   |   |   |-- Referral.model.ts
|   |   |   |-- Review.model.ts
|   |   |   |-- RoommateProfile.model.ts
|   |   |   |-- SafetyReport.model.ts
|   |   |   |-- SavedSearch.model.ts
|   |   |   |-- SOSAlert.model.ts
|   |   |   `-- User.model.ts
|   |   |-- routes
|   |   |   |-- admin.routes.ts
|   |   |   |-- analytics.routes.ts
|   |   |   |-- auth.routes.ts
|   |   |   |-- banner.routes.ts
|   |   |   |-- campaign.routes.ts
|   |   |   |-- chat.routes.ts
|   |   |   |-- community.routes.ts
|   |   |   |-- escrow.routes.ts
|   |   |   |-- maintenance.routes.ts
|   |   |   |-- payment.routes.ts
|   |   |   |-- property.routes.ts
|   |   |   |-- qr.routes.ts
|   |   |   |-- referral.routes.ts
|   |   |   |-- review.routes.ts
|   |   |   |-- roommate.routes.ts
|   |   |   |-- safety.routes.ts
|   |   |   `-- search.routes.ts
|   |   |-- services
|   |   |   |-- ai.service.ts
|   |   |   |-- analytics.service.ts
|   |   |   |-- auth.service.ts
|   |   |   |-- banner.service.ts
|   |   |   |-- chat.service.ts
|   |   |   |-- escrow.service.ts
|   |   |   |-- export.service.ts
|   |   |   |-- fraudDetection.service.ts
|   |   |   |-- geocoding.service.ts
|   |   |   |-- idVerification.service.ts
|   |   |   |-- mpesa.service.ts
|   |   |   |-- notification.service.ts
|   |   |   |-- payment.service.ts
|   |   |   |-- property.service.ts
|   |   |   |-- push.service.ts
|   |   |   |-- qr.service.ts
|   |   |   |-- recommendation.service.ts
|   |   |   |-- referral.service.ts
|   |   |   |-- roommateMatching.service.ts
|   |   |   |-- safety.service.ts
|   |   |   |-- search.service.ts
|   |   |   |-- sms.service.ts
|   |   |   `-- weather.service.ts
|   |   |-- sockets
|   |   |   |-- chat.socket.ts
|   |   |   |-- location.socket.ts
|   |   |   |-- notification.socket.ts
|   |   |   |-- qr.socket.ts
|   |   |   `-- sos.socket.ts
|   |   |-- types
|   |   |   |-- banner.types.ts
|   |   |   |-- express.types.ts
|   |   |   |-- payment.types.ts
|   |   |   |-- property.types.ts
|   |   |   |-- qr.types.ts
|   |   |   |-- safety.types.ts
|   |   |   `-- user.types.ts
|   |   |-- utils
|   |   |   |-- bcrypt.ts
|   |   |   |-- emailTemplates.ts
|   |   |   |-- formatters.ts
|   |   |   |-- jwt.ts
|   |   |   |-- otp.ts
|   |   |   |-- qrGenerator.ts
|   |   |   `-- validators.ts
|   |   |-- webhooks
|   |   |   |-- mapbox.webhook.ts
|   |   |   |-- mpesa.webhook.ts
|   |   |   `-- stripe.webhook.ts
|   |   `-- workers
|   |       `-- worker.ts
|   |-- tests
|   |   |-- fixtures
|   |   |-- integration
|   |   `-- unit
|   `-- tsconfig.json
|-- docker
|   |-- docker-compose.staging.yml
|   |-- docker-compose.yml
|   |-- Dockerfile.admin
|   |-- Dockerfile.backend
|   |-- Dockerfile.nginx
|   |-- Dockerfile.redis
|   `-- Dockerfile.worker
|-- docs
|   |-- API_DOCS.md
|   |-- DATABASE_SCHEMA.md
|   |-- DEPLOYMENT.md
|   |-- QR_SYSTEM.md
|   |-- SAFETY_TRUST_POLICY.md
|   `-- USER_FLOWS.md
|-- .github
|   `-- workflows
|       |-- ci.yml
|       |-- deploy-production.yml
|       `-- deploy-staging.yml
|-- .gitignore
|-- infra
|   |-- configmap.yaml
|   |-- deployment.yaml
|   |-- ingress.yaml
|   `-- service.yaml
|-- LICENSE
|-- Makefile
|-- mark soma hi.md
|-- project-structure-full.md
|-- README.md
|-- scripts
|   |-- backup.sh
|   |-- deploy.sh
|   |-- generate-qr.sh
|   `-- seed.sh
`-- shared
    |-- types
    |   `-- shared.types.ts
    `-- utils
        |-- formatters.ts
        `-- validators.ts

194 directories, 650 files
