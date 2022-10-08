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

  const { runContractFunction: enterRaffle } = useWeb3Contract({
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
    <div>
      Hi from lottery entrance!
      {raffleAddress ? (
        <div>
          Entrance fee: {ethers.utils.formatUnits(entranceFee, "ether")} ETH{" "}
          <br />
          Number of players: {numPlayers}
          <br />
          Recent winner: {recentWinner}
          <br />
          <button
            onClick={async () =>
              await enterRaffle({
                onSuccess: handeSuccess,
                onError: (err) => console.log(err),
              })
            }
          >
            Enter Raffle
          </button>
        </div>
      ) : (
        ""
      )}
    </div>
  )
}

export default LotteryEntrance
