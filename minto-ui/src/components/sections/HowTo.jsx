import { Container } from "react-bootstrap"
import { Link } from "react-router-dom"

const HowTo = () => {
  return (
    <>
        <div className="bg-success-subtle">
            <Container className="py-4">
                <h2 className="text-xl text-center py-3">See how it works and get started in less than 2 minutes</h2>
                <div className="text-center">
                    <Link className="btn btn-success w-50 my-3 px-3" to="/login">Get Started</Link>
                </div>
            </Container>
        </div>
      
    </>
  )
}

export default HowTo
