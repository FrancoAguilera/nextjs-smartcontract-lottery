// function to enter the lottery
import { useEffect, userState, useState } from "react"
import { useWeb3Contract } from "react-moralis"
import { useMoralis } from "react-moralis"
import { abi, contractAddress } from "../constants/"
import { ethers } from "ethers"
import { useNotification } from "web3uikit"

function LotteryEntrance() {
  const { chainId: chainIdHex, isWeb3Enabled } = useMoralis()
  const dispatch = useNotification()
  const chainId = parseInt(chainIdHex)

  const [entranceFee, setEntranceFee] = useState("0")
  const [numPlayers, setNumPlayers] = useState("0")
  const [recentWinner, setRecentWinner] = useState("0")

  const raffleAddress =
    chainId in contractAddress ? contractAddress[chainId][0] : null

  const {
    runContractFunction: enterRaffle,
    isLoading,
    isFetching,
  } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress,
    functionName: "enterRaffle",
    params: {},
    msgValue: entranceFee,
  })

  const { runContractFunction: getEntranceFee } = useWeb3Contract({
    functionName: "getEntranceFee",
    contractAddress: raffleAddress,
    abi: abi,
    params: {},
  })

  const { runContractFunction: getNumberOfPlayers } = useWeb3Contract({
    functionName: "getNumberOfPlayers",
    contractAddress: raffleAddress,
    abi: abi,
    params: {},
  })

  const { runContractFunction: getRecentWinner } = useWeb3Contract({
    functionName: "getRecentWinner",
    contractAddress: raffleAddress,
    abi: abi,
    params: {},
  })

  async function updateUI() {
    const entranceFeeFromContract = (await getEntranceFee()).toString()
    const numberOfPlayers = (await getNumberOfPlayers()).toString()
    const lastWinner = (await getRecentWinner()).toString()

    setEntranceFee(entranceFeeFromContract)
    setNumPlayers(numberOfPlayers)
    setRecentWinner(lastWinner)
  }

  useEffect(() => {
    if (isWeb3Enabled) {
      updateUI()
    }
  }, [isWeb3Enabled])

  const handeSuccess = async (tx) => {
    await tx.wait(1)
    handleNewNotification(tx)
    updateUI()
  }

  const handleNewNotification = (tx) => {
    dispatch({
      type: "info",
      message: "Transaction complete",
      title: "Tx Notification",
      position: "topR",
      icon: "Bell",
    })
  }

  return (
    <div className="p-5">
      Hi from lottery entrance!
      {raffleAddress ? (
        <div className="">
          <button
            type="button"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto"
            onClick={async () =>
              await enterRaffle({
                onSuccess: handeSuccess,
                onError: (err) => console.log(err),
              })
            }
            disabled={isLoading || isFetching}
          >
            {isLoading || isFetching ? (
              <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>
            ) : (
              "Enter Raffle"
            )}
          </button>
          <div>
            Entrance fee: {ethers.utils.formatUnits(entranceFee, "ether")} ETH{" "}
          </div>
          <div>Number of players: {numPlayers}</div>
          <div>Recent winner: {recentWinner}</div>
        </div>
      ) : (
        ""
      )}
    </div>
  )
}

export default LotteryEntrance
