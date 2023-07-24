import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import abi from "./abi.json"
import { ConnectKitButton, ConnectKitProvider } from 'connectkit';
import { useContractReads, useContractWrite, usePrepareContractWrite } from 'wagmi';
import { ethers } from 'ethers';

const Contract = {
	address: "0x11De72301F05Ab0e41d6C8972dE32D1eb905b215",
	abi: abi
}
const App = () => {
	const [account, setAccount] = useState('');
	const [domainName, setDomainName] = useState('');

	const { data, isLoading } = useContractReads({
		allowFailure: false,
		contracts: [
			{
				...Contract,
				functionName: 'calculateRegistrationFee',
				args: [domainName],
			},
			{
				...Contract,
				functionName: 'getDomainOwner',
				args: [domainName],
			},
		],
		watch: true
	})

	var cost = 0;
	var isDomainTaken = false;
	if (!isLoading && data) {
		cost = data[0]
		isDomainTaken = data[1] != "0x0000000000000000000000000000000000000000"
	}

	return (
		<div className="flex items-center justify-center min-h-screen bg-gray-200">
			<div className="p-6 bg-white rounded shadow-xl min-w-[25rem]">
				<input
					type="text"
					placeholder="Enter domain name"
					onChange={(e) => setDomainName(e.target.value)}
					className="w-full p-2 mb-4 border rounded"
				/>
				{domainName.length > 0 &&
					<div className="mb-4">
						<p className="text-lg">Domain Cost: {ethers.utils.formatEther(cost)} tRBTC</p>
						<p className="text-lg">Domain Status: {isDomainTaken ? <font color='red'>Taken</font> : <font color='green'>Available</font>}</p>
					</div>
				}

				<ConnectKitProvider>
					<ConnectKitButton.Custom>
						{({ isConnected, show, address, ensName }) => {
							if (!isConnected) {
								return (
									<button
										onClick={() => { show() }}
										className="w-full px-4 py-2 text-white bg-blue-600 rounded"
									>
										Connect Wallet
									</button>
								)
							}
							return (
								<Register domain={domainName} cost={cost} />
							);
						}}
					</ConnectKitButton.Custom>
				</ConnectKitProvider>
			</div>
		</div>
	);
};

export default App;

const Register = (props) => {
	console.log(props)

	const { config } = usePrepareContractWrite({
		...Contract,
		functionName: "mintDomain",
		args: [props.domain],
		overrides: {
			value: props.cost,
		}
	})

	const contractWrite = useContractWrite(config)

	return (
		<button
			onClick={() => { contractWrite.write() }}
			className="w-full px-4 py-2 text-white bg-blue-600 rounded"
		>
			Register Domain
		</button>
	)
}