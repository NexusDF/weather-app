import { addIcon } from '@iconify/vue/offline'
import cloud from '@iconify-icons/lucide/cloud'
import cloudFog from '@iconify-icons/lucide/cloud-fog'
import cloudLightning from '@iconify-icons/lucide/cloud-lightning'
import cloudMoon from '@iconify-icons/lucide/cloud-moon'
import cloudRain from '@iconify-icons/lucide/cloud-rain'
import cloudSnow from '@iconify-icons/lucide/cloud-snow'
import cloudSun from '@iconify-icons/lucide/cloud-sun'
import droplets from '@iconify-icons/lucide/droplets'
import gauge from '@iconify-icons/lucide/gauge'
import heart from '@iconify-icons/lucide/heart'
import loaderCircle from '@iconify-icons/lucide/loader-circle'
import locate from '@iconify-icons/lucide/locate'
import moon from '@iconify-icons/lucide/moon'
import search from '@iconify-icons/lucide/search'
import settings from '@iconify-icons/lucide/settings'
import sun from '@iconify-icons/lucide/sun'
import sunrise from '@iconify-icons/lucide/sunrise'
import sunset from '@iconify-icons/lucide/sunset'
import wind from '@iconify-icons/lucide/wind'
import x from '@iconify-icons/lucide/x'

const icons = {
  'lucide:cloud': cloud,
  'lucide:cloud-fog': cloudFog,
  'lucide:cloud-lightning': cloudLightning,
  'lucide:cloud-moon': cloudMoon,
  'lucide:cloud-rain': cloudRain,
  'lucide:cloud-snow': cloudSnow,
  'lucide:cloud-sun': cloudSun,
  'lucide:droplets': droplets,
  'lucide:gauge': gauge,
  'lucide:heart': heart,
  'lucide:loader-circle': loaderCircle,
  'lucide:locate': locate,
  'lucide:moon': moon,
  'lucide:search': search,
  'lucide:settings': settings,
  'lucide:sun': sun,
  'lucide:sunrise': sunrise,
  'lucide:sunset': sunset,
  'lucide:wind': wind,
  'lucide:x': x,
}

for (const [name, data] of Object.entries(icons)) addIcon(name, data)
