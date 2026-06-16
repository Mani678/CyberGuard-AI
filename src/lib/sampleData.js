// Sample security logs and incident data for demo purposes

export const SAMPLE_LOGS = {
  ransomware: `[2024-01-15 02:14:33] CRITICAL SIEM-ALERT: Ransomware behavior detected on WORKSTATION-047
[2024-01-15 02:14:31] EDR: Mass file encryption initiated - 2,847 files affected in C:\\Users\\jsmith\\Documents
[2024-01-15 02:14:28] EDR: Process 'svchost32.exe' (PID 4821) spawned by 'winword.exe' - SUSPICIOUS
[2024-01-15 02:13:55] FIREWALL: Outbound C2 beacon detected - 185.220.101.47:443 (Tor exit node)
[2024-01-15 02:13:22] EMAIL-GW: Phishing email delivered to jsmith@company.com - attachment: Invoice_Q4_2024.docm
[2024-01-15 02:13:22] EMAIL-GW: Macro-enabled document opened by user jsmith on WORKSTATION-047
[2024-01-15 02:12:01] PROXY: Suspicious domain lookup - update-service[.]ru resolved to 185.220.101.47
[2024-01-15 02:10:44] AD-LOG: jsmith authenticated from WORKSTATION-047 (normal)
[2024-01-15 02:08:12] IDS: Lateral movement attempt - WORKSTATION-047 scanning internal subnet 10.0.1.0/24
[2024-01-15 02:07:55] IDS: SMB brute force from 10.0.1.47 targeting DC-01, DC-02
[2024-01-15 02:06:33] SIEM: Privilege escalation - jsmith account added to Domain Admins group
[2024-01-15 02:05:17] SIEM: Credential dumping tool (Mimikatz signature) detected on WORKSTATION-047
[2024-01-15 02:04:44] EDR: PowerShell execution policy bypass - encoded command executed
[2024-01-15 02:04:44] EDR: PowerShell: [base64] JABjAGwAaQBlAG4AdAAgAD0AIABOAGUAdwAtAE8AYgBqAGUAYwB0...
[2024-01-15 02:04:12] FIREWALL: Inbound connection from 91.108.4.0/22 (known APT infrastructure)
[2024-01-15 01:58:33] AV: Alert suppressed - false positive whitelist (INVESTIGATING)
[2024-01-15 01:45:22] BACKUP-SRV: Backup service stopped on FILESERVER-01, FILESERVER-02
[2024-01-15 01:44:55] AD-LOG: Shadow copy deletion - vssadmin delete shadows /all /quiet
[2024-01-15 01:30:00] SIEM: Large data exfiltration - 47GB transferred to 45.142.212.100 (RU)
[2024-01-15 00:12:44] IDS: Port scan from external IP 91.108.4.152 on ports 80,443,3389,22`,

  dataexfil: `[2024-01-20 14:22:11] DLP: CRITICAL - Bulk data export detected from CRM database
[2024-01-20 14:22:08] DB-AUDIT: User 'svc_reporting' executed: SELECT * FROM customers LIMIT 500000
[2024-01-20 14:21:55] DB-AUDIT: Unusual query pattern - 847 queries in 60 seconds from svc_reporting
[2024-01-20 14:20:33] PROXY: Large upload to dropbox.com - 8.4GB in 12 minutes from 10.0.5.88
[2024-01-20 14:19:44] IAM: Service account 'svc_reporting' logged in from IP 203.0.113.45 (EXTERNAL - ANOMALOUS)
[2024-01-20 14:18:22] SIEM: After-hours access - svc_reporting accessed at 14:18 (normal hours: 09:00-17:00 EST)
[2024-01-20 14:15:11] VPN: New VPN session from 203.0.113.45 using credentials of terminated employee M.Chen
[2024-01-20 13:55:00] HR-SYSTEM: Employee M.Chen terminated 2024-01-18 - account deprovisioning PENDING
[2024-01-20 14:00:44] AD-LOG: svc_reporting password reset by mchen@company.com (2 days after termination)
[2024-01-20 09:22:15] EMAIL-GW: Forwarding rule created - mchen@company.com -> external_mchen@gmail.com
[2024-01-20 09:22:10] OFFICE365: Inbox rule created silently (no user notification) for mchen account
[2024-01-20 08:45:33] DLP: 340 customer records emailed to external_mchen@gmail.com
[2024-01-20 08:44:12] SIEM: USB mass storage device connected on LAPTOP-MCS (M.Chen's workstation)
[2024-01-20 08:40:00] BADGE: M.Chen badge access to Server Room B - AFTER TERMINATION`,

  apt: `[2024-01-25 03:44:12] SIEM: CRITICAL - Suspected APT activity detected across multiple systems
[2024-01-25 03:44:10] EDR: Living-off-the-land attack - LOLBin execution chain: certutil -> bitsadmin -> regsvr32
[2024-01-25 03:43:55] EDR: Scheduled task created: 'WindowsDefenderUpdate' pointing to C:\\ProgramData\\update.ps1
[2024-01-25 03:42:33] NETWORK: DNS tunneling detected - unusually large TXT record queries to cdn-update[.]com
[2024-01-25 03:41:22] IDS: Beaconing pattern detected - RESEARCH-PC-12 calling out every 300s to 104.21.45.67
[2024-01-25 03:38:11] AD-LOG: Golden ticket attack suspected - Kerberos TGT with 10-year lifetime issued
[2024-01-25 03:35:44] SIEM: DCSync attack - non-DC host replicating AD database (RESEARCH-PC-12)
[2024-01-25 03:30:22] EDR: Pass-the-hash detected - NTLM relay from RESEARCH-PC-12 to FINANCE-SRV-01
[2024-01-25 03:25:11] FIREWALL: Unusual outbound - RDP traffic to 185.56.80.0/22 (bulletproof hosting)
[2024-01-25 03:20:00] SIEM: Data staged in C:\\Windows\\Temp\\cab_XXXX - 12GB compressed archive
[2024-01-25 02:15:33] EDR: Watering hole attack - researcher visited compromised industry blog
[2024-01-25 02:15:30] PROXY: Drive-by download from legitimate-research-news[.]com
[2024-01-25 02:15:28] EDR: Browser exploit - Chrome CVE-2023-6345 triggered on RESEARCH-PC-12
[2024-01-25 02:10:00] SIEM: Initial access vector: Spear-phishing PDF sent to cto@company.com (opened)
[2024-01-25 01:00:00] EMAIL-GW: Highly targeted email from spoofed IEEE domain - PDF attachment
[2024-01-24 23:45:00] OSINT-FEED: Threat actor 'APT-Dragon' targeting aerospace/defense sector (HIGH CONFIDENCE)`
}

export const INCIDENT_TEMPLATES = [
  {
    id: 'ransomware',
    title: 'Ransomware Attack — Finance Department',
    severity: 'CRITICAL',
    description: 'Mass file encryption detected with C2 beaconing and credential dumping',
    logs: SAMPLE_LOGS.ransomware
  },
  {
    id: 'dataexfil',
    title: 'Insider Threat — Customer Data Exfiltration',
    severity: 'HIGH',
    description: 'Terminated employee accessing systems and exfiltrating customer records',
    logs: SAMPLE_LOGS.dataexfil
  },
  {
    id: 'apt',
    title: 'APT Intrusion — Research Network',
    severity: 'CRITICAL',
    description: 'Suspected nation-state actor with persistent access across research systems',
    logs: SAMPLE_LOGS.apt
  }
]
