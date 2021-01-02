import MerkleTree, {
	checkProof,
	merkleRoot,
	checkProofSolidityFactory,
} from 'merkle-tree-solidity';

import { sha3 } from 'ethereumjs-util';

class MerkleTreeHelper {
	constructor(hashes) {
		this.elements = hashes;
		this.merkleTree = this.createTree();
		this.root = this.merkleTree.getRoot();
	}

	createTree() {
		return new MerkleTree(this.elements);
	}

	getRoot() {
		return this.root;
	}

	getProof(element) {
		let proof = [];
		try {
			proof = this.merkleTree.getProof(element);
		} catch (e) {
			return [];
		}
		return proof;
	}

	checkProof(element) {
		return checkProof(this.getProof(element), this.root, element);
	}
}

export default MerkleTreeHelper;
