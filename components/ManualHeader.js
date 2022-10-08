import { useEffect } from "react"
import { useMoralis } from "react-moralis"

function ManualHeader() {
  const {
    enableWeb3,
    account,
    isWeb3Enabled,
    Moralis,
    deactivateWeb3,
    isWeb3EnabledLoading,
  } = useMoralis()

  useEffect(() => {
    if (isWeb3Enabled) return

    if (typeof windows === "undefined") return

    if (window.localStorage.getItem("connected")) {
      enableWeb3()
    }
  }, [isWeb3Enabled])

  useEffect(() => {
    Moralis.onAccountChanged(() => {
      console.log(`Account changed to : ${account}`)
      if (account == null) {
        window.localStorage.removeItem("connected")
        deactivateWeb3()
        console.log("Null account found")
      }
    })
  }, [Moralis, account])

  return (
    <div>
      {account ? (
        <div>Connected to {account}</div>
      ) : (
        <button
          disabled={isWeb3EnabledLoading}
          onClick={async () => {
            await enableWeb3()
            window.localStorage.setItem("connected", "injected")
          }}
        >
          Connect
        </button>
      )}
    </div>
  )
}

export default ManualHeader
