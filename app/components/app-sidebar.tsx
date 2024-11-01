import * as React from 'react';
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
  Cog,
} from 'lucide-react';

import { NavMain } from '~/components/nav-main';
import { NavProjects } from '~/components/nav-projects';
import { NavUser } from '~/components/nav-user';
import { TeamSwitcher } from '~/components/team-switcher';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '~/components/ui/sidebar';

// This is sample data.
const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    // avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: 'Acme Inc',
      logo: GalleryVerticalEnd,
      plan: 'Enterprise',
    },
    {
      name: 'Acme Corp.',
      logo: AudioWaveform,
      plan: 'Startup',
    },
    {
      name: 'Evil Corp.',
      logo: Command,
      plan: 'Free',
    },
  ],
  navMain: [
    {
      title: 'Master',
      url: '#',
      icon: Cog,
      isActive: true,
      items: [
        {
          title: 'Category',
          url: '/admin/category',
        },
        {
          title: 'Product',
          url: '#',
        },
        {
          title: 'Settings',
          url: '#',
        },
      ],
    },
  ],
};

export function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
