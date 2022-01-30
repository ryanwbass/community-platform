export async function getServerSideProps(context) {
  return {
    props: {
      slug: context.params.slug
    }
  }
}

export default function HowtoArticle({slug}) {
  return (
    <div>
      <pre>{JSON.stringify(slug)}</pre>
      <h1>Slug: {slug}</h1>
      <p>Individual How to article</p>

      <footer>
        Published {Date.now()}
      </footer>
    </div>
  )
}
