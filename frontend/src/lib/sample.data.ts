import {
  Users,
  CalendarCheck,
  BedDouble,
  Wallet,
  type LucideIcon,
} from 'lucide-react'

export type Trend = 'up' | 'down'

export interface Kpi {
  key: string
  title: string
  value: number
  display: (n: number) => string
  suffix?: string
  change: string
  trend: Trend
  icon: LucideIcon
  spark: number[]
  accent: string // chart var name
}

export const kpis: Kpi[] = [
  {
    key: 'patients',
    title: 'Patients Today',
    value: 428,
    display: (n) => Math.round(n).toLocaleString(),
    change: '+9.2%',
    trend: 'up',
    icon: Users,
    spark: [22, 28, 26, 34, 30, 42, 48, 44, 52],
    accent: 'var(--chart-1)',
  },
  {
    key: 'appointments',
    title: 'Appointments',
    value: 186,
    display: (n) => Math.round(n).toLocaleString(),
    change: '+4.7%',
    trend: 'up',
    icon: CalendarCheck,
    spark: [12, 16, 14, 20, 24, 22, 28, 26, 31],
    accent: 'var(--chart-2)',
  },
  {
    key: 'occupancy',
    title: 'Bed Occupancy',
    value: 82,
    display: (n) => Math.round(n).toString(),
    suffix: '%',
    change: '-3.1%',
    trend: 'down',
    icon: BedDouble,
    spark: [70, 74, 78, 76, 84, 88, 85, 83, 82],
    accent: 'var(--chart-3)',
  },
  {
    key: 'revenue',
    title: 'Revenue (Today)',
    value: 38420,
    display: (n) => '$' + Math.round(n).toLocaleString(),
    change: '+12.4%',
    trend: 'up',
    icon: Wallet,
    spark: [18, 24, 22, 30, 28, 36, 40, 38, 46],
    accent: 'var(--chart-4)',
  },
]

export const patientFlow = [
  { day: 'Mon', admitted: 42, discharged: 30, outpatient: 120 },
  { day: 'Tue', admitted: 51, discharged: 38, outpatient: 142 },
  { day: 'Wed', admitted: 47, discharged: 44, outpatient: 158 },
  { day: 'Thu', admitted: 60, discharged: 41, outpatient: 171 },
  { day: 'Fri', admitted: 68, discharged: 52, outpatient: 196 },
  { day: 'Sat', admitted: 55, discharged: 60, outpatient: 210 },
  { day: 'Sun', admitted: 39, discharged: 47, outpatient: 148 },
]

export const departments = [
  { name: 'Cardiology', value: 28, color: 'var(--chart-1)' },
  { name: 'Pediatrics', value: 22, color: 'var(--chart-2)' },
  { name: 'Orthopedics', value: 18, color: 'var(--chart-3)' },
  { name: 'Neurology', value: 16, color: 'var(--chart-4)' },
  { name: 'General', value: 16, color: 'var(--chart-5)' },
]

export const appointmentsByHour = [
  { hour: '8a', booked: 14, completed: 12 },
  { hour: '9a', booked: 22, completed: 20 },
  { hour: '10a', booked: 30, completed: 27 },
  { hour: '11a', booked: 26, completed: 24 },
  { hour: '12p', booked: 18, completed: 16 },
  { hour: '1p', booked: 24, completed: 20 },
  { hour: '2p', booked: 32, completed: 28 },
  { hour: '3p', booked: 28, completed: 22 },
]

export interface Appointment {
  id: string
  patient: string
  initials: string
  reason: string
  doctor: string
  time: string
  status: 'confirmed' | 'waiting' | 'in-progress'
  dept: string
}

export const appointments: Appointment[] = [
  {
    id: 'a1',
    patient: 'Sarah Mitchell',
    initials: 'SM',
    reason: 'Cardiac follow-up',
    doctor: 'Dr. Reyes',
    time: '09:30',
    status: 'in-progress',
    dept: 'Cardiology',
  },
  {
    id: 'a2',
    patient: 'James Okonkwo',
    initials: 'JO',
    reason: 'Post-op review',
    doctor: 'Dr. Bennett',
    time: '09:45',
    status: 'confirmed',
    dept: 'Orthopedics',
  },
  {
    id: 'a3',
    patient: 'Aisha Rahman',
    initials: 'AR',
    reason: 'Pediatric checkup',
    doctor: 'Dr. Lindqvist',
    time: '10:00',
    status: 'waiting',
    dept: 'Pediatrics',
  },
  {
    id: 'a4',
    patient: 'Daniel Weber',
    initials: 'DW',
    reason: 'Migraine consult',
    doctor: 'Dr. Osei',
    time: '10:15',
    status: 'confirmed',
    dept: 'Neurology',
  },
  {
    id: 'a5',
    patient: 'Elena Popova',
    initials: 'EP',
    reason: 'Annual physical',
    doctor: 'Dr. Reyes',
    time: '10:30',
    status: 'waiting',
    dept: 'General',
  },
]

export interface Doctor {
  name: string
  specialty: string
  initials: string
  status: 'available' | 'in-surgery' | 'off'
  patients: number
}

export const doctors: Doctor[] = [
  {
    name: 'Dr. Marcus Reyes',
    specialty: 'Cardiology',
    initials: 'MR',
    status: 'available',
    patients: 8,
  },
  {
    name: 'Dr. Hannah Bennett',
    specialty: 'Orthopedics',
    initials: 'HB',
    status: 'in-surgery',
    patients: 3,
  },
  {
    name: 'Dr. Erik Lindqvist',
    specialty: 'Pediatrics',
    initials: 'EL',
    status: 'available',
    patients: 11,
  },
  {
    name: 'Dr. Ama Osei',
    specialty: 'Neurology',
    initials: 'AO',
    status: 'off',
    patients: 0,
  },
]

export interface ActivityItem {
  id: string
  type: 'admission' | 'lab' | 'discharge' | 'alert' | 'appointment'
  text: string
  detail: string
  time: string
}

export const activity: ActivityItem[] = [
  {
    id: 'e1',
    type: 'alert',
    text: 'Critical lab flagged',
    detail: 'Bed 12 — elevated troponin, cardiology notified',
    time: '2 min ago',
  },
  {
    id: 'e2',
    type: 'admission',
    text: 'New admission',
    detail: 'Elena Popova admitted to General Ward',
    time: '18 min ago',
  },
  {
    id: 'e3',
    type: 'lab',
    text: 'Lab results ready',
    detail: 'CBC panel for James Okonkwo',
    time: '41 min ago',
  },
  {
    id: 'e4',
    type: 'discharge',
    text: 'Patient discharged',
    detail: 'Room 204 cleared and sanitized',
    time: '1 hr ago',
  },
  {
    id: 'e5',
    type: 'appointment',
    text: 'Appointment booked',
    detail: 'Daniel Weber — Neurology, 10:15',
    time: '2 hrs ago',
  },
]

export const navItems = [
  { label: 'Dashboard', icon: 'LayoutDashboard', active: true },
  { label: 'Appointments', icon: 'CalendarDays', badge: 12 },
  { label: 'Patients', icon: 'Users' },
  { label: 'Departments', icon: 'Building2' },
  { label: 'Staff', icon: 'Stethoscope' },
  { label: 'Laboratory', icon: 'FlaskConical', badge: 3 },
  { label: 'Pharmacy', icon: 'Pill' },
  { label: 'Billing', icon: 'Wallet' },
  { label: 'Reports', icon: 'BarChart3' },
] as const
