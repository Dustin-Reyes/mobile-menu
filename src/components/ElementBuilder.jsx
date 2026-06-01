import { useState } from 'react';
import styled from '@emotion/styled';
import Pill from 'components/Pill';
import CodeBlock from 'components/CodeBlock';

// ─── Styled layout ─────────────────────────────────────────────────────────────

const BuilderRoot = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const SectionLabel = styled.p`
  font-size: ${(p) => p.theme.typography.fontSizes.s4};
  font-weight: ${(p) => p.theme.typography.fontWeights.medium};
  color: ${(p) => p.theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 0.5rem;
`;

const AttributesRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const PreviewBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: ${(p) => p.theme.borderRadius.s2};
`;

// ─── Code string builder ────────────────────────────────────────────────────────

function buildCodeString(componentName, defaultChildren, activeProps) {
  const propsStr = Object.entries(activeProps)
    .map(([k, v]) => (typeof v === 'boolean' ? k : `${k}="${v}"`))
    .join(' ');
  const indent = propsStr ? ` ${propsStr}` : '';
  return `<${componentName}${indent}>${defaultChildren}</${componentName}>`;
}

// ─── ElementBuilder ─────────────────────────────────────────────────────────────

/**
 * Interactive component builder. Accepts a config describing a component and
 * its toggleable attributes. Clicking a Pill chip toggles a prop on/off,
 * simultaneously updating the live preview and the generated code block.
 *
 * @prop {object} config.component         — React component to render live
 * @prop {string} config.componentName     — JSX name for code generation
 * @prop {string} config.defaultChildren   — Inner text of the rendered component
 * @prop {Array}  config.attributes        — Attribute definitions (see shape below)
 *
 * Attribute shape:
 *   id          — unique key
 *   label       — pill display text
 *   prop        — JSX prop name
 *   value       — value to apply
 *   group       — exclusive group name (null for boolean toggle)
 *   pillVariant — Pill color variant when active
 */
const ElementBuilder = ({ config }) => {
  const {
    component: Component,
    componentName,
    defaultChildren,
    attributes,
  } = config;
  const [activeIds, setActiveIds] = useState(new Set());

  const toggle = (id) => {
    const attr = attributes.find((a) => a.id === id);
    if (!attr) return;

    setActiveIds((prev) => {
      const next = new Set(prev);

      if (attr.group) {
        // Exclusive group: deactivate all others in group, toggle this one
        const sameGroup = attributes
          .filter((a) => a.group === attr.group)
          .map((a) => a.id);
        sameGroup.forEach((gid) => next.delete(gid));
        if (!prev.has(id)) {
          next.add(id);
        }
      } else {
        // Boolean toggle
        if (next.has(id)) {
          next.delete(id);
        } else {
          next.add(id);
        }
      }

      return next;
    });
  };

  // Compute active props from active IDs
  const activeProps = {};
  for (const id of activeIds) {
    const attr = attributes.find((a) => a.id === id);
    if (attr) activeProps[attr.prop] = attr.value;
  }

  const codeString = buildCodeString(
    componentName,
    defaultChildren,
    activeProps,
  );

  return (
    <BuilderRoot>
      <div>
        <SectionLabel>Attributes</SectionLabel>
        <AttributesRow>
          {attributes.map((attr) => {
            const isActive = activeIds.has(attr.id);
            return (
              <Pill
                key={attr.id}
                as="button"
                type="button"
                onClick={() => toggle(attr.id)}
                aria-pressed={isActive}
                variant={isActive ? attr.pillVariant || 'primary' : 'default'}
                styleVariant={isActive ? 'solid' : 'outline'}
                style={{ cursor: 'pointer' }}
              >
                {attr.label}
              </Pill>
            );
          })}
        </AttributesRow>
      </div>

      <div>
        <SectionLabel>Preview</SectionLabel>
        <PreviewBox data-testid="element-builder-preview">
          <Component {...activeProps}>{defaultChildren}</Component>
        </PreviewBox>
      </div>

      <CodeBlock language="jsx" description="Generated code">
        {codeString}
      </CodeBlock>
    </BuilderRoot>
  );
};

export default ElementBuilder;
