import { CashStack, Hourglass, Magic, MegaphoneFill } from 'react-bootstrap-icons';

const Features = () => {
    return (
        <>
            <div id="features" className="text-center">
                <div className="container py-5">
                    <div className="section-title">
                        <h2>Features</h2>
                    </div>
                    <div className="row">
                        <div className="col-xs-6 col-md-3"> 
                            <Hourglass className='features-icon' />
                            <h3>Lorem ipsum</h3>
                            <p>Lorem ipsum dolor sit amet placerat facilisis felis mi in tempus eleifend pellentesque natoque etiam.</p>
                        </div>
                        <div className="col-xs-6 col-md-3"> 
                            <MegaphoneFill className='features-icon' />
                            <h3>Lorem ipsum</h3>
                            <p>Lorem ipsum dolor sit amet placerat facilisis felis mi in tempus eleifend pellentesque natoque etiam.</p>
                        </div>
                        <div className="col-xs-6 col-md-3"> 
                            <CashStack className='features-icon' />
                            <h3>Lorem ipsum</h3>
                            <p>Lorem ipsum dolor sit amet placerat facilisis felis mi in tempus eleifend pellentesque natoque etiam.</p>
                        </div>
                        <div className="col-xs-6 col-md-3"> 
                            <Magic className='features-icon' />
                            <h3>Lorem ipsum</h3>
                            <p>Lorem ipsum dolor sit amet placerat facilisis felis mi in tempus eleifend pellentesque natoque etiam.</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row">
                
            </div>
        </>
    )
}

export default Features
