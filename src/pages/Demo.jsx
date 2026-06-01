import DemoLayout from '../dev/demo/DemoLayout';
import ColorsSection from '../dev/demo/sections/ColorsSection';
import TypographySection from '../dev/demo/sections/TypographySection';
import BorderRadiusSection from '../dev/demo/sections/BorderRadiusSection';
import ShadowsSection from '../dev/demo/sections/ShadowsSection';
import ButtonSection from '../dev/demo/sections/ButtonSection';
import InputSection from '../dev/demo/sections/InputSection';
import PillSection from '../dev/demo/sections/PillSection';
import CardSection from '../dev/demo/sections/CardSection';
import TabsSection from '../dev/demo/sections/TabsSection';
import AccordionSection from '../dev/demo/sections/AccordionSection';
import DialogSection from '../dev/demo/sections/DialogSection';
import DropdownMenuSection from '../dev/demo/sections/DropdownMenuSection';
import SwitchSection from '../dev/demo/sections/SwitchSection';
import ScrollAreaSection from '../dev/demo/sections/ScrollAreaSection';
import SeparatorSection from '../dev/demo/sections/SeparatorSection';
import MotionSection from '../dev/demo/sections/MotionSection';
import ToastSection from '../dev/demo/sections/ToastSection';
import DeveloperUtilitiesSection from '../dev/demo/sections/DeveloperUtilitiesSection';

// ─── Sidebar navigation config ────────────────────────────────────────────────

const SIDEBAR_SECTIONS = [
  // Design Tokens group
  { id: 'colors', label: 'Colors', group: 'tokens' },
  { id: 'typography', label: 'Typography', group: 'tokens' },
  { id: 'border-radius', label: 'Border Radius', group: 'tokens' },
  { id: 'shadows', label: 'Shadows', group: 'tokens' },

  // Components group
  { id: 'button', label: 'Button', group: 'components' },
  { id: 'input', label: 'Input', group: 'components' },
  { id: 'pill', label: 'Pill', group: 'components' },
  { id: 'card', label: 'Card', group: 'components' },
  { id: 'tabs', label: 'Tabs', group: 'components' },
  { id: 'accordion', label: 'Accordion', group: 'components' },
  { id: 'dialog', label: 'Dialog', group: 'components' },
  { id: 'dropdown-menu', label: 'Dropdown Menu', group: 'components' },
  { id: 'switch', label: 'Switch', group: 'components' },
  { id: 'scroll-area', label: 'Scroll Area', group: 'components' },
  { id: 'separator', label: 'Separator', group: 'components' },
  { id: 'toast', label: 'Toast', group: 'components' },

  // Motion & Animation group
  { id: 'motion', label: 'Motion & Animation', group: 'motion' },

  // Developer Utilities (collapsed in sidebar)
  { id: 'dev-utilities', label: 'Developer Utilities', group: 'dev' },
];

// ─── Demo page ─────────────────────────────────────────────────────────────────

function Demo() {
  return (
    <DemoLayout sections={SIDEBAR_SECTIONS}>
      {/* Design Tokens */}
      <ColorsSection />
      <TypographySection />
      <BorderRadiusSection />
      <ShadowsSection />

      {/* Components */}
      <ButtonSection />
      <InputSection />
      <PillSection />
      <CardSection />
      <TabsSection />
      <AccordionSection />
      <DialogSection />
      <DropdownMenuSection />
      <SwitchSection />
      <ScrollAreaSection />
      <SeparatorSection />
      <ToastSection />

      {/* Motion & Animation */}
      <MotionSection />

      {/* Developer Utilities */}
      <DeveloperUtilitiesSection />
    </DemoLayout>
  );
}

export default Demo;
