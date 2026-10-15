import type { BuilderBlock } from "@/types/theme";

function findInBlockTree(
  blockId: string,
  blocks: Record<string, BuilderBlock>,
  matches: (block: BuilderBlock, blockId: string) => boolean
): boolean {
  const pending = [blockId];
  const visited = new Set<string>();

  while (pending.length > 0) {
    const currentId = pending.pop();
    if (currentId === undefined || visited.has(currentId)) continue;
    visited.add(currentId);

    const block = blocks[currentId];
    if (!block) continue;
    if (matches(block, currentId)) return true;

    for (const childId of block.childrenIds || []) {
      pending.push(childId);
    }
  }

  return false;
}

export const isHeaderOrFooterBlock = (
  blockId: string,
  blocks: Record<string, BuilderBlock>
): boolean =>
  findInBlockTree(
    blockId,
    blocks,
    (block) => block.type === "header" || block.type === "footer"
  );

export const isBlockOrDescendant = (
  blockId: string,
  candidateId: string,
  blocks: Record<string, BuilderBlock>
): boolean =>
  findInBlockTree(blockId, blocks, (_block, currentId) => currentId === candidateId);
