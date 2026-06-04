export const NODE_WIDTH = 280;
export const NODE_HEIGHT = 175;

export async function getLayoutedElements(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  nodes: any[],
  direction: "RIGHT" | "DOWN",
) {
  const isRight = direction === "RIGHT";
  const nodeW = isRight ? 280 : 255;
  const nodeH = 175;
  const zonePaddingX = isRight ? 24 : 16;
  const zonePaddingY = isRight ? 24 : 16;
  const zoneHeaderH = 64;
  const nodeGapY = 16;
  const zoneSpacing = isRight ? 56 : 40;

  // 1. Separate zones and architecture nodes
  const zoneNodes = nodes.filter((n) => n.type === "zone");
  const archNodes = nodes.filter((n) => n.type === "architecture");

  // 2. Map zones to their respective architecture nodes
  const zoneMap = new Map<string, any[]>();
  for (const zone of zoneNodes) {
    zoneMap.set(zone.id, []);
  }

  for (const node of archNodes) {
    const parentId = node.parentId;
    if (parentId && zoneMap.has(parentId)) {
      zoneMap.get(parentId)!.push(node);
    } else {
      // Fallback: match by data.zoneId
      const zoneId = node.data?.zoneId;
      const key = zoneId ? `zone-${zoneId}` : null;
      if (key && zoneMap.has(key)) {
        zoneMap.get(key)!.push(node);
      }
    }
  }

  // 3. Layout calculation
  let cumulativePosition = 0;
  const updatedNodes = [...nodes];

  for (const zoneNode of zoneNodes) {
    const children = zoneMap.get(zoneNode.id) || [];
    const n = children.length;

    // Dimensions of this zone
    const zoneWidth = nodeW + 2 * zonePaddingX;
    const zoneHeight = zoneHeaderH + 2 * zonePaddingY + n * nodeH + Math.max(0, n - 1) * nodeGapY;

    // Update zone properties
    zoneNode.style = {
      ...zoneNode.style,
      width: zoneWidth,
      height: zoneHeight,
    };

    if (isRight) {
      zoneNode.position = {
        x: cumulativePosition,
        y: 0,
      };
      cumulativePosition += zoneWidth + zoneSpacing;
    } else {
      zoneNode.position = {
        x: 0,
        y: cumulativePosition,
      };
      cumulativePosition += zoneHeight + zoneSpacing;
    }

    // Layout the child nodes relative to this zone parent
    children.forEach((childNode, index) => {
      const foundIndex = updatedNodes.findIndex((n) => n.id === childNode.id);
      if (foundIndex !== -1) {
        updatedNodes[foundIndex] = {
          ...childNode,
          parentId: zoneNode.id,
          extent: "parent",
          position: {
            x: zonePaddingX,
            y: zoneHeaderH + zonePaddingY + index * (nodeH + nodeGapY),
          },
          style: {
            ...childNode.style,
            width: nodeW,
            height: nodeH,
          },
        };
      }
    });
  }

  return updatedNodes;
}