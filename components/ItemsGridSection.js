import styled from 'styled-components'
import Image from "next/image"
import colors from '../styles/colors'

const StyledGrid = styled.div`
&.styled-grid {

  /* display: flex;
  flex-wrap: wrap; */
  /* justify-content: space-evenly; */
  margin: 0 auto;
  margin-bottom: 15px;

  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, max-content));
  grid-gap: 2px;
  justify-content: center;
  /* border: 1px solid rgba(0,0,0,.3); */
}

  .menu-item {
    min-height: 80px;
    min-width: 150px;
    max-width: 150px;
    margin: 2px 2px;
    cursor: pointer;

    .top-menu-item {

      .top-menu-bg {
        background: ${colors.green};
        min-height: 150px;
      }
      .top-menu-id {
        margin-top: 0px;
        margin-bottom: 0px;
        padding-top: 10px;
        padding-bottom: 10px;
        text-align: center;
      }
    }
    .bottom-menu-item {
      border: 1px solid rgba(0,0,0,.1);
      padding: 6px;

      .bottom-menu-item-text {
        margin-top: 4px;
        margin-bottom: 0px;
      }
    }
  }
`

export const ItemsGridSection = ({
  menuItems,
  handleMenuItemClick
}) => {


  return (
    <StyledGrid className="styled-grid">
      {menuItems.map((menuItem, index) => (
        <div className={"menu-item"} key={`${index}-${menuItem.name}`} onClick={() => handleMenuItemClick(menuItem.id)}>
          <div className="top-menu-item">
            <h4 className="top-menu-id">#{menuItem.id}</h4>
            <div className="top-menu-bg"><Image src={menuItem.imageSrc} alt="food-logo" height={150} width={150} /></div>
          </div>
          <div className="bottom-menu-item">
            <h5 className="bottom-menu-item-text">{menuItem.name} - ${menuItem.price}</h5>
          </div>
          {/* <p>{menuItem.types.map((t, t_index) => <span key={`${t}-${t_index}`}>{t}, </span>)}</p> */}
          {/* <p>{menuItem.category}</p> */}
        </div>
      ))}
    </StyledGrid>
  )
}