import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { getCompany } from '../lib/graphql/queries';
import JobList from '../components/JobList';

function CompanyPage() {
  const [state, setState] = useState({
    company: null,
    loading: true,
    error: false
  })
  const { companyId } = useParams();

  const { company, loading, error } = state
  useEffect(() => {
    (async () => {
      try {
        const company = await getCompany(companyId)
        setState({ company, loading: false, error: false })
      } catch(error) {
        setState({company, loading: true, error: true})
      }
    })()
  }, [companyId, company])


  if (loading) {
    return <div>Loading...</div>
  }
  if (error) {
    return <div>Data unavailable</div>
  }
  return (
    <div>
      <h1 className="title">
        {company.name}
      </h1>
      <div className="box">
        {company.description}
      </div>
      <h2 className="title is-5">
        Jobs at {company.name}
      </h2>
      <JobList jobs={company.jobs} />
    </div>
  );
}

export default CompanyPage;
