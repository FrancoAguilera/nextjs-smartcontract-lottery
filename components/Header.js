import { ConnectButton } from "web3uikit"

function Header() {
  return (
    <div>
      Descentalized Lottery
      <ConnectButton moralisAuth={false} />
    </div>
  )
}

export default Header
