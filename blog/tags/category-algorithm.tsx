import Link from '@docusaurus/Link';

export default function AlgorithmPage() {
  return (
    <main className="container margin-vert--lg">
      <h1>算法</h1>
      <p>算法题解、竞赛记录和数据结构学习。</p>

      <div className="row">
        <div className="col col--4">
          <Link className="card padding--lg" to="/blog/tags/array">
            <h2>数组</h2>
            <p>数组、双指针和滑动窗口。</p>
          </Link>
        </div>

        <div className="col col--4">
          <Link className="card padding--lg" to="/blog/tags/dynamic-programming">
            <h2>动态规划</h2>
            <p>背包、区间和状态转移。</p>
          </Link>
        </div>

        <div className="col col--4">
          <Link className="card padding--lg" to="/blog/tags/graph">
            <h2>图论</h2>
            <p>搜索、最短路和并查集。</p>
          </Link>
        </div>
      </div>

      <Link className="button button--primary margin-top--lg" to="/blog/tags/category-algorithm">
        查看全部算法文章
      </Link>
    </main>
  );
}