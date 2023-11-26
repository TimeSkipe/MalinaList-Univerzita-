

/* Loading ... (skeleton) do urciteho seznamu*/ 
export const LoadingComponentList = () => {
    return(
      <div className='ListDetailBlock'>
      <div className='ListDetailTitle'>------</div>

      <div className='ListDInfa'>
        <div className='LD-ItemsList'>
          <div className='LD-ItemSkeleton'></div>
          <div className='LD-ItemSkeleton'></div>
          <div className='LD-ItemSkeleton'></div>
        </div>

        <div className='LD-MemberListSkeleton'>
          <div className='LD-MemeberHead'>
            <div className='a'>------</div>  
          </div>
        </div>
      </div>
    </div>
    )
  }

export const LoadingComponentLists = () =>{
    return(
        <div className='ListsBlock'>
            <div className='ListTitleCreate'>
                <div className='Title'>-----</div>   
            </div>
            <div className='ListOfLists'>
                <div className='ListoBarSkeleton'></div>
                <div className='ListoBarSkeleton'></div>
                <div className='ListoBarSkeleton'></div>
                <div className='ListoBarSkeleton'></div>
            </div>
            
    </div>
    )
}