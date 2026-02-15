# Mathematics and Their Axioms: A Comprehensive Inventory

This document catalogs the major branches of mathematics alongside their axiomatic
foundations. It is organized from the most foundational systems (logic, set theory) outward
through algebra, analysis, geometry, topology, and into specialized and modern frameworks.

---

## Table of Contents

1. [Formal Logic](#1-formal-logic)
2. [Set Theory](#2-set-theory)
3. [Number Systems](#3-number-systems)
4. [Abstract Algebra](#4-abstract-algebra)
5. [Order Theory](#5-order-theory)
6. [Linear Algebra and Vector Spaces](#6-linear-algebra-and-vector-spaces)
7. [Analysis and Metric Spaces](#7-analysis-and-metric-spaces)
8. [Topology](#8-topology)
9. [Geometry](#9-geometry)
10. [Probability and Measure Theory](#10-probability-and-measure-theory)
11. [Algebraic Topology](#11-algebraic-topology)
12. [Category Theory](#12-category-theory)
13. [Combinatorics and Matroids](#13-combinatorics-and-matroids)
14. [Type Theory and Constructive Foundations](#14-type-theory-and-constructive-foundations)
15. [Mathematical Physics](#15-mathematical-physics)
16. [The Landscape: How These Systems Relate](#16-the-landscape-how-these-systems-relate)

---

## 1. Formal Logic

Logic supplies the inference rules and axiom schemas that underpin all other mathematical
systems. The two core levels are propositional logic and first-order predicate logic.

### 1.1 Propositional Logic (Hilbert-Style Axiomatization)

A Hilbert system uses many axiom schemas and very few inference rules. One standard
axiomatization (due to Jan Lukasiewicz) uses three axiom schemas and one rule:

**Axiom Schemas:**
1. **A1:** &phi; &rarr; (&psi; &rarr; &phi;)
2. **A2:** (&phi; &rarr; (&psi; &rarr; &chi;)) &rarr; ((&phi; &rarr; &psi;) &rarr; (&phi; &rarr; &chi;))
3. **A3:** (&not;&phi; &rarr; &not;&psi;) &rarr; (&psi; &rarr; &phi;)

**Rule of Inference:**
- **Modus Ponens:** From &phi; and &phi; &rarr; &psi;, infer &psi;.

### 1.2 First-Order Predicate Logic

Extends propositional logic with quantifiers (&forall;, &exists;) and predicates. Additional axiom
schemas and one additional rule are needed:

**Additional Axiom Schemas:**
4. **Universal Instantiation:** &forall;x &phi;(x) &rarr; &phi;(t), where t is substitutable for x
5. **Universal Distribution:** &forall;x (&phi; &rarr; &psi;) &rarr; (&phi; &rarr; &forall;x &psi;), provided x is not free in &phi;
6. **Existential:** &exists;x &phi;(x) &harr; &not;&forall;x &not;&phi;(x)

**Additional Rule:**
- **Generalization:** From &phi;, infer &forall;x &phi;.

---

## 2. Set Theory

Set theory provides the foundational language for nearly all of modern mathematics. Several
competing axiomatizations exist.

### 2.1 Zermelo-Fraenkel Set Theory with Choice (ZFC)

The dominant foundation since the mid-20th century. ZFC has 9 axioms (one is actually an
axiom schema):

1. **Extensionality:** Two sets are equal if and only if they have the same elements.
   - &forall;A &forall;B (&forall;x (x &isin; A &harr; x &isin; B) &rarr; A = B)

2. **Pairing:** For any two sets, there exists a set containing exactly those two.
   - &forall;a &forall;b &exist;C &forall;x (x &isin; C &harr; x = a &or; x = b)

3. **Union:** For any set of sets, there exists a set that is their union.
   - &forall;A &exist;B &forall;x (x &isin; B &harr; &exist;C (x &isin; C &and; C &isin; A))

4. **Power Set:** For any set, there exists the set of all its subsets.
   - &forall;A &exist;P &forall;B (B &isin; P &harr; B &sube; A)

5. **Separation (Comprehension) Schema:** For any set and any property, there exists the
   subset of elements satisfying that property.
   - &forall;A &exist;B &forall;x (x &isin; B &harr; x &isin; A &and; &phi;(x))

6. **Infinity:** There exists an infinite set (containing 0 and closed under successor).
   - &exist;S (&empty; &isin; S &and; &forall;x (x &isin; S &rarr; x &cup; {x} &isin; S))

7. **Replacement Schema:** The image of a set under any definable function is also a set.
   - If &phi; defines a function on A, then {&phi;(x) : x &isin; A} is a set.

8. **Foundation (Regularity):** Every non-empty set contains an element disjoint from itself.
   - &forall;A (A &ne; &empty; &rarr; &exist;x (x &isin; A &and; x &cap; A = &empty;))
   - This prevents circular membership chains (no set is a member of itself).

9. **Choice (AC):** Every family of non-empty sets has a choice function.
   - For every collection of non-empty sets, there exists a function selecting one element
     from each set.

**Note on ZF vs. ZFC:** "ZF" refers to axioms 1-8 without Choice. The Axiom of Choice is
independent of ZF (proved by Godel and Cohen).

### 2.2 Von Neumann-Bernays-Godel Set Theory (NBG)

A conservative extension of ZFC that distinguishes between **sets** and **proper classes**.

**Key differences from ZFC:**
- Two sorts of objects: sets and classes (every set is a class; a proper class is not a set)
- **Finitely axiomatizable** (unlike ZFC's axiom schemas)
- Includes the **Axiom of Global Choice** (stronger than AC): there exists a single function
  choosing from every non-empty set
- Proves the same theorems about sets as ZFC (conservative extension)

### 2.3 Morse-Kelley Set Theory (MK)

Stronger than both ZFC and NBG.

**Key differences:**
- Like NBG, distinguishes sets and classes
- Class comprehension allows quantification over **all classes** (not just sets)
- **Not finitely axiomatizable**
- Proves the consistency of ZFC (unlike NBG, which cannot)

### 2.4 Quine's New Foundations (NF)

Proposed by W.V.O. Quine in 1937. A radically different approach.

**Axioms:**
1. **Extensionality:** Same as ZFC.
2. **Stratified Comprehension:** {x : &phi;(x)} exists for any **stratified** formula &phi; (where
   type indices can be assigned consistently to variables).

**Notable properties:**
- Allows a universal set V &isin; V (no Foundation axiom)
- The Axiom of Choice is **disprovable** in NF
- Cantor's theorem fails for some sets
- Consistency with ZFC was an open problem for decades; recently claimed proved by
  Randall Holmes (2010s-2020s)

### 2.5 Extensions: Large Cardinals and Determinacy

Beyond ZFC, set theorists study additional axioms that extend the universe:

**Large Cardinal Axioms** (examples in increasing strength):
- Inaccessible cardinals
- Mahlo cardinals
- Measurable cardinals
- Woodin cardinals
- Supercompact cardinals

These are not provable from ZFC but are consistent with it (assuming ZFC itself is consistent).

**Axiom of Determinacy (AD):**
- Every two-player game of perfect information on natural numbers is determined (one player
  has a winning strategy)
- **Contradicts the Axiom of Choice**
- The consistency of ZF + AD is equivalent to the consistency of ZFC + infinitely many
  Woodin cardinals

---

## 3. Number Systems

### 3.1 Natural Numbers: Peano Axioms

Giuseppe Peano (1889) formalized arithmetic with five axioms:

1. **Zero exists:** 0 is a natural number.
2. **Successor:** For every natural number n, S(n) is a natural number.
3. **Zero is not a successor:** There is no natural number n such that S(n) = 0.
4. **Injectivity of successor:** If S(m) = S(n), then m = n.
5. **Induction:** If a property holds for 0, and whenever it holds for n it also holds for
   S(n), then it holds for all natural numbers.

Addition and multiplication are then defined recursively:
- m + 0 = m; m + S(n) = S(m + n)
- m &times; 0 = 0; m &times; S(n) = (m &times; n) + m

**Metamathematical properties:**
- First-order Peano Arithmetic (PA) is incomplete (Godel's incompleteness theorems)
- PA cannot prove its own consistency
- Second-order Peano axioms are categorical (all models are isomorphic to N)

### 3.2 Integers, Rationals: Construction, Not Axiomatization

The integers Z and rationals Q are typically **constructed** from N rather than independently
axiomatized:
- Z = equivalence classes of pairs (a, b) from N &times; N, where (a,b) ~ (c,d) iff a+d = b+c
- Q = equivalence classes of pairs (a, b) from Z &times; Z\{0}, where (a,b) ~ (c,d) iff ad = bc

### 3.3 Real Numbers: Complete Ordered Field Axioms

The reals R are characterized as the unique (up to isomorphism) complete ordered field.

**Field Axioms (for addition):**
1. Associativity: (a + b) + c = a + (b + c)
2. Commutativity: a + b = b + a
3. Identity: There exists 0 such that a + 0 = a
4. Inverse: For each a, there exists -a such that a + (-a) = 0

**Field Axioms (for multiplication):**
5. Associativity: (a &middot; b) &middot; c = a &middot; (b &middot; c)
6. Commutativity: a &middot; b = b &middot; a
7. Identity: There exists 1 &ne; 0 such that a &middot; 1 = a
8. Inverse: For each a &ne; 0, there exists a&supmin;&sup1; such that a &middot; a&supmin;&sup1; = 1

**Distributive Law:**
9. a &middot; (b + c) = a &middot; b + a &middot; c

**Order Axioms (for a total order &le;):**
10. Trichotomy: For all a, b, exactly one holds: a < b, a = b, or a > b
11. Transitivity: a < b and b < c implies a < c
12. Additive compatibility: a < b implies a + c < b + c
13. Multiplicative compatibility: a < b and 0 < c implies ac < bc

**Completeness Axiom:**
14. **Least Upper Bound (Dedekind Completeness):** Every non-empty subset of R that is
    bounded above has a least upper bound (supremum) in R.

This single axiom distinguishes R from Q. Equivalent formulations:
- Every Cauchy sequence converges
- Nested intervals property
- Every Dedekind cut is realized by a real number

---

## 4. Abstract Algebra

Abstract algebra studies sets equipped with operations satisfying specific axioms. The
structures form a hierarchy of increasing richness.

### 4.1 Magma (Groupoid)

The simplest algebraic structure: a set with a single binary operation.

**Axiom:**
1. **Closure:** For all a, b in S, a &middot; b is in S.

### 4.2 Semigroup

A magma with associativity.

**Axioms:**
1. Closure
2. **Associativity:** (a &middot; b) &middot; c = a &middot; (b &middot; c)

### 4.3 Monoid

A semigroup with an identity element.

**Axioms:**
1. Closure
2. Associativity
3. **Identity:** There exists e in S such that e &middot; a = a &middot; e = a for all a.

### 4.4 Group

A monoid where every element has an inverse.

**Axioms:**
1. Closure
2. Associativity
3. Identity
4. **Inverse:** For each a, there exists a&supmin;&sup1; such that a &middot; a&supmin;&sup1; = a&supmin;&sup1; &middot; a = e.

**Abelian (Commutative) Group** adds:
5. **Commutativity:** a &middot; b = b &middot; a

### 4.5 Ring

A set with two operations (addition and multiplication).

**Axioms:**
1. (R, +) is an abelian group (with identity 0)
2. (R, &middot;) is a monoid (with identity 1) — or just a semigroup for "rngs" (rings without unity)
3. **Left distributivity:** a &middot; (b + c) = a &middot; b + a &middot; c
4. **Right distributivity:** (a + b) &middot; c = a &middot; c + b &middot; c

**Commutative Ring** adds: a &middot; b = b &middot; a

**Integral Domain:** A commutative ring with no zero divisors (ab = 0 implies a = 0 or b = 0)

**Division Ring (Skew Field):** A ring where every non-zero element has a multiplicative inverse

### 4.6 Field

A commutative division ring. Equivalently:

**Axioms:**
1. (F, +) is an abelian group with identity 0
2. (F \ {0}, &middot;) is an abelian group with identity 1
3. Multiplication distributes over addition

### 4.7 Module

A generalization of vector spaces where scalars come from a ring (not necessarily a field).

**Axioms** (for a left R-module M):
1. (M, +) is an abelian group
2. **Scalar multiplication** r(m + n) = rm + rn
3. (r + s)m = rm + sm
4. (rs)m = r(sm)
5. 1&middot;m = m (if R has unity)

### 4.8 Lie Algebra

A vector space L over a field F equipped with a bilinear operation [&middot;, &middot;] called the
Lie bracket.

**Axioms:**
1. **Bilinearity:** [ax + by, z] = a[x,z] + b[y,z] and [z, ax + by] = a[z,x] + b[z,y]
2. **Skew-symmetry (Alternating):** [x, x] = 0 for all x
   - (This implies [x, y] = -[y, x] when char(F) &ne; 2)
3. **Jacobi Identity:** [x, [y, z]] + [y, [z, x]] + [z, [x, y]] = 0

The Jacobi identity says that the adjoint map ad_x = [x, -] is a derivation.

### 4.9 Boolean Algebra

**Axioms** (Huntington, 1904):
1. **Associativity:** a &or; (b &or; c) = (a &or; b) &or; c; a &and; (b &and; c) = (a &and; b) &and; c
2. **Commutativity:** a &or; b = b &or; a; a &and; b = b &and; a
3. **Absorption:** a &or; (a &and; b) = a; a &and; (a &or; b) = a
4. **Distributivity:** a &or; (b &and; c) = (a &or; b) &and; (a &or; c); a &and; (b &or; c) = (a &and; b) &or; (a &and; c)
5. **Complement:** a &or; &not;a = 1; a &and; &not;a = 0

Axioms 1-3 define a **lattice**. Adding 4 gives a **distributive lattice**. Adding 5 gives
a Boolean algebra.

**Historical note:** The Robbins conjecture (1933), proved by automated theorem prover EQP
in 1996, showed that the Robbins equation &not;(&not;(a &or; b) &or; &not;(a &or; &not;b)) = a, together
with associativity and commutativity of &or;, suffices to axiomatize Boolean algebra.

---

## 5. Order Theory

### 5.1 Partial Order (Poset)

A set P with a binary relation &le; satisfying:

1. **Reflexivity:** a &le; a
2. **Antisymmetry:** a &le; b and b &le; a implies a = b
3. **Transitivity:** a &le; b and b &le; c implies a &le; c

**Strict partial order** (<) satisfies irreflexivity and transitivity.

### 5.2 Total (Linear) Order

A partial order with an additional axiom:

4. **Totality (Comparability):** For all a, b: a &le; b or b &le; a

Equivalently: **trichotomy** — exactly one of a < b, a = b, b < a holds.

### 5.3 Well-Order

A total order where:

5. **Well-ordering:** Every non-empty subset has a least element.

**Key theorem:** The Well-Ordering Theorem (equivalent to the Axiom of Choice) states that
every set can be well-ordered.

### 5.4 Lattice

A partially ordered set where every two-element subset has a join (least upper bound) and a
meet (greatest lower bound).

**Algebraic axioms** (equivalent formulation as an algebraic structure with &and; and &or;):
1. Associativity of &and; and &or;
2. Commutativity of &and; and &or;
3. Absorption: a &and; (a &or; b) = a and a &or; (a &and; b) = a
4. Idempotency: a &and; a = a and a &or; a = a

---

## 6. Linear Algebra and Vector Spaces

### 6.1 Vector Space

A set V over a field F with two operations (vector addition and scalar multiplication).

**Vector Addition Axioms** — (V, +) is an abelian group:
1. Associativity: (u + v) + w = u + (v + w)
2. Commutativity: u + v = v + u
3. Identity: There exists **0** such that v + **0** = v
4. Inverse: For each v, there exists -v such that v + (-v) = **0**

**Scalar Multiplication Axioms:**
5. Compatibility: a(bv) = (ab)v
6. Scalar identity: 1v = v
7. Distributivity over vector addition: a(u + v) = au + av
8. Distributivity over scalar addition: (a + b)v = av + bv

### 6.2 Inner Product Space

A vector space V over R (or C) equipped with an inner product &lang;&middot;, &middot;&rang;.

**Axioms (real case):**
1. **Symmetry:** &lang;x, y&rang; = &lang;y, x&rang;
2. **Linearity in the first argument:** &lang;ax + by, z&rang; = a&lang;x, z&rang; + b&lang;y, z&rang;
3. **Positive-definiteness:** &lang;x, x&rang; &ge; 0, with equality iff x = **0**

**Axioms (complex case):**
1. **Conjugate symmetry:** &lang;x, y&rang; = conjugate(&lang;y, x&rang;)
2. **Linearity in one argument** (convention varies: first or second)
3. **Positive-definiteness:** &lang;x, x&rang; &ge; 0 (real-valued), with equality iff x = **0**

Every inner product induces a norm: ||x|| = sqrt(&lang;x, x&rang;).

### 6.3 Normed Space

A vector space V with a norm ||&middot;||.

**Axioms:**
1. **Positive-definiteness:** ||v|| &ge; 0, with equality iff v = **0**
2. **Absolute homogeneity:** ||av|| = |a| &middot; ||v||
3. **Triangle inequality:** ||u + v|| &le; ||u|| + ||v||

Every norm induces a metric: d(u, v) = ||u - v||.

---

## 7. Analysis and Metric Spaces

### 7.1 Metric Space

A set M with a distance function d: M &times; M &rarr; R.

**Axioms:**
1. **Non-negativity:** d(x, y) &ge; 0
2. **Identity of indiscernibles:** d(x, y) = 0 if and only if x = y
3. **Symmetry:** d(x, y) = d(y, x)
4. **Triangle inequality:** d(x, z) &le; d(x, y) + d(y, z)

**Pseudometric:** Relaxes axiom 2 to d(x,y) = 0 does not imply x = y.
**Ultrametric:** Strengthens axiom 4 to d(x,z) &le; max(d(x,y), d(y,z)).

### 7.2 Banach Space

A complete normed vector space.

**Axioms:** All vector space axioms + norm axioms + completeness (every Cauchy sequence
converges to a limit in the space).

### 7.3 Hilbert Space

A complete inner product space.

**Axioms:** All vector space axioms + inner product axioms + completeness.

**Relationship hierarchy:**
Inner product space &sub; Normed space &sub; Metric space &sub; Topological space
Complete inner product space (Hilbert) &sub; Complete normed space (Banach)

---

## 8. Topology

### 8.1 Topological Space (Open Set Axioms)

A set X together with a collection &tau; of subsets (called "open sets").

**Axioms:**
1. &empty; &isin; &tau; and X &isin; &tau;
2. **Arbitrary unions:** If {U_i} &sube; &tau;, then &cup; U_i &isin; &tau;
3. **Finite intersections:** If U_1, ..., U_n &isin; &tau;, then U_1 &cap; ... &cap; U_n &isin; &tau;

**Equivalent formulations** (closed-set axioms, Kuratowski closure axioms, neighborhood
axioms) exist and define the same concept.

### 8.2 Separation Axioms

Additional axioms that refine topological spaces:

- **T0 (Kolmogorov):** For any two distinct points, at least one has a neighborhood not
  containing the other.
- **T1 (Frechet):** For any two distinct points, each has a neighborhood not containing the
  other. Equivalently, singletons are closed.
- **T2 (Hausdorff):** Any two distinct points have disjoint open neighborhoods.
- **T3 (Regular):** T1 + points and closed sets can be separated by open neighborhoods.
- **T3.5 (Tychonoff):** T1 + points and closed sets can be separated by continuous functions.
- **T4 (Normal):** T1 + disjoint closed sets can be separated by open neighborhoods.

### 8.3 Compactness Axioms

- **Compact:** Every open cover has a finite subcover.
- **Locally compact:** Every point has a compact neighborhood.
- **Sequentially compact:** Every sequence has a convergent subsequence.
- **Countably compact:** Every countable open cover has a finite subcover.

---

## 9. Geometry

### 9.1 Euclid's Axioms (~300 BCE)

The original axiomatization, from *Elements*. Divided into postulates (geometric) and
common notions (general logical/arithmetic principles).

**Five Postulates:**
1. A straight line can be drawn from any point to any point.
2. A finite straight line can be extended continuously in a straight line.
3. A circle can be described with any center and radius.
4. All right angles are equal to one another.
5. **(Parallel Postulate):** If a line falling on two lines makes the interior angles on one
   side less than two right angles, the two lines, if extended, meet on that side.

**Common Notions:**
1. Things equal to the same thing are equal to one another.
2. If equals are added to equals, the wholes are equal.
3. If equals are subtracted from equals, the remainders are equal.
4. Things that coincide with one another are equal to one another.
5. The whole is greater than the part.

**Historical significance:** The independence of the parallel postulate from the other four
led to the discovery of non-Euclidean geometries (Lobachevsky, Bolyai, Riemann) in the
19th century.

### 9.2 Hilbert's Axioms (1899)

David Hilbert's rigorous reformulation in *Grundlagen der Geometrie*. Contains 20 axioms
in five groups, using three primitive terms: point, line, plane.

**I. Incidence Axioms (8 axioms):**
- I.1: Two distinct points determine a unique line.
- I.2: Any two distinct points on a line determine that line.
- I.3: A line contains at least two points; there exist at least three non-collinear points.
- I.4-I.8: Analogous axioms for planes and their relationships with points and lines.

**II. Order (Betweenness) Axioms (4 axioms):**
- II.1: If B is between A and C, then A, B, C are distinct collinear points and B is between
  C and A.
- II.2: For any two points A, B, there exists C such that B is between A and C.
- II.3: Of three collinear points, exactly one is between the other two.
- II.4 (Pasch's Axiom): A line entering a triangle through one side (not at a vertex) must
  exit through another side.

**III. Congruence Axioms (5 axioms):**
- III.1-III.3: Segment congruence (existence, transitivity, additivity).
- III.4: Angle congruence (transportability).
- III.5 (SAS): Side-angle-side triangle congruence.

**IV. Continuity Axioms (2 axioms):**
- IV.1 (Archimedes' Axiom): Given segments AB and CD, finitely many copies of CD laid end
  to end will exceed AB.
- IV.2 (Completeness): The points on a line cannot be extended while preserving the other
  axioms. (This is the geometric counterpart of Dedekind completeness.)

**V. Parallel Axiom (1 axiom):**
- V.1 (Playfair's Axiom): Through a point not on a line, there exists exactly one line
  parallel to the given line.

### 9.3 Birkhoff's Axioms (1932)

G.D. Birkhoff proposed a minimalist axiomatization based on ruler and protractor.

**Four Postulates:**
1. **Ruler Postulate:** Points on a line can be put into 1-1 correspondence with the real
   numbers.
2. **Point of Division:** A line segment has a unique midpoint.
3. **Protractor Postulate:** Angles at a point can be measured by real numbers in [0, 180).
4. **SAS Similarity:** If two triangles share an angle and the including sides are
   proportional, the triangles are similar.

### 9.4 Tarski's Axioms (1926/1959)

Alfred Tarski's first-order axiomatization using only **points** as primitive objects, with
two primitive relations: **betweenness** and **congruence**.

**Key properties:**
- First-order theory (unlike Hilbert's, which uses second-order axioms)
- Consistent, complete, and decidable (Tarski proved this)
- There exists an algorithm to determine the truth of any statement in the theory
- Fewer axiom schemas than Hilbert's system

### 9.5 Non-Euclidean Geometries

Obtained by modifying the parallel postulate:

- **Hyperbolic Geometry (Lobachevsky-Bolyai):** Through a point not on a line, there are
  **infinitely many** lines parallel to the given line. Negative curvature.
- **Elliptic Geometry (Riemann):** Through a point not on a line, there are **no** lines
  parallel to the given line. Positive curvature. (Requires also modifying Euclid's second
  postulate to allow lines to be finite/closed.)

---

## 10. Probability and Measure Theory

### 10.1 Kolmogorov's Probability Axioms (1933)

A probability space is a triple (&Omega;, F, P) where:
- &Omega; is the sample space
- F is a &sigma;-algebra of subsets of &Omega; (the events)
- P: F &rarr; [0, 1] is the probability measure

**Axioms for P:**
1. **Non-negativity:** P(A) &ge; 0 for all A &isin; F
2. **Unitarity:** P(&Omega;) = 1
3. **&sigma;-additivity (Countable Additivity):** For any countable sequence of pairwise disjoint
   events A_1, A_2, ...:
   P(&cup; A_i) = &sum; P(A_i)

### 10.2 &sigma;-Algebra Axioms

The collection F of measurable sets satisfies:

1. &Omega; &isin; F
2. **Closure under complement:** If A &isin; F, then &Omega; \ A &isin; F
3. **Closure under countable union:** If A_1, A_2, ... &isin; F, then &cup; A_i &isin; F

### 10.3 General Measure Theory

A measure on a measurable space (X, &Sigma;) is a function &mu;: &Sigma; &rarr; [0, &infin;] satisfying:

1. **Non-negativity:** &mu;(A) &ge; 0
2. **Null empty set:** &mu;(&empty;) = 0
3. **&sigma;-additivity:** For pairwise disjoint measurable sets A_1, A_2, ...:
   &mu;(&cup; A_i) = &sum; &mu;(A_i)

Probability is the special case where &mu;(&Omega;) = 1.

---

## 11. Algebraic Topology

### 11.1 Eilenberg-Steenrod Axioms (1945)

These axioms characterize homology theories on the category of topological pairs.

A homology theory is a sequence of functors H_n (for n = 0, 1, 2, ...) and natural
transformations satisfying:

1. **Homotopy Axiom:** Homotopic maps induce the same homomorphisms.
2. **Exactness Axiom:** For each pair (X, A), there is a long exact sequence:
   ... &rarr; H_n(A) &rarr; H_n(X) &rarr; H_n(X, A) &rarr; H_{n-1}(A) &rarr; ...
3. **Excision Axiom:** If U &sub; A &sub; X and the closure of U is contained in the interior
   of A, then H_n(X \ U, A \ U) &cong; H_n(X, A).
4. **Dimension Axiom:** H_n(point) = 0 for n &ne; 0, and H_0(point) &cong; Z (or the
   coefficient group).

**Generalized (extraordinary) homology theories** satisfy axioms 1-3 but not 4. Examples:
topological K-theory, cobordism theory.

---

## 12. Category Theory

### 12.1 Axioms of a Category (Eilenberg-Mac Lane, 1945)

A category C consists of:
- A class of **objects** ob(C)
- For each pair of objects A, B, a class of **morphisms** (arrows) Hom(A, B)
- A **composition** operation: if f: A &rarr; B and g: B &rarr; C, then g &circ; f: A &rarr; C

**Axioms:**
1. **Associativity:** h &circ; (g &circ; f) = (h &circ; g) &circ; f whenever the compositions are defined.
2. **Identity:** For every object X, there exists a morphism id_X: X &rarr; X such that for
   every f: A &rarr; X and g: X &rarr; B:
   - id_X &circ; f = f
   - g &circ; id_X = g

**Historical note:** Eilenberg and Mac Lane introduced categories not as an end in themselves
but to define **functors**, which in turn were needed to define **natural transformations**.
The concept proved far more fundamental than originally anticipated.

### 12.2 Functor Axioms

A functor F: C &rarr; D between categories preserves:
1. **Objects:** Assigns to each object X in C an object F(X) in D.
2. **Morphisms:** Assigns to each f: X &rarr; Y a morphism F(f): F(X) &rarr; F(Y).
3. **Identity:** F(id_X) = id_{F(X)}.
4. **Composition:** F(g &circ; f) = F(g) &circ; F(f).

---

## 13. Combinatorics and Matroids

### 13.1 Matroid Axioms (Whitney, 1935)

A matroid is a pair (E, I) where E is a finite set and I is a family of subsets of E
(called independent sets).

**Independence Axioms:**
1. **Non-emptiness:** &empty; &isin; I
2. **Hereditary:** If A &isin; I and B &sube; A, then B &isin; I
3. **Augmentation (Exchange):** If A, B &isin; I and |A| < |B|, then there exists b &isin; B \ A
   such that A &cup; {b} &isin; I

**Equivalent axiomatizations** exist in terms of:
- **Bases:** Maximal independent sets, satisfying the basis exchange property
- **Circuits:** Minimal dependent sets, satisfying the circuit elimination axiom
- **Rank function:** An integer-valued function satisfying submodularity
- **Closure operator:** Satisfying the Steinitz-Mac Lane exchange property

**Motivating examples:**
- Linear independence of vectors in a vector space
- Acyclicity of edge sets in a graph (graphic matroid)

---

## 14. Type Theory and Constructive Foundations

### 14.1 Simple Type Theory (Church, 1940)

Alonzo Church's simply typed lambda calculus. Types are built from base types using the
function type constructor (&rarr;).

**Key rules:**
- Variables have types
- If M: A &rarr; B and N: A, then (M N): B (application)
- If x: A and M: B, then (&lambda;x. M): A &rarr; B (abstraction)

### 14.2 Martin-Lof Intuitionistic Type Theory (1972)

Per Martin-Lof's dependent type theory, proposed as a foundation for constructive
mathematics. Unlike set theory, type theories are defined by **rules of inference**, not
axioms.

**Core judgment forms:**
- A type (A is a type)
- a : A (a is a term of type A)
- a = b : A (a and b are definitionally equal terms of type A)

**Type formers (each with formation, introduction, elimination, computation rules):**
- **Dependent function types (&Pi;):** &Pi;(x:A). B(x) — generalizes function types
- **Dependent pair types (&Sigma;):** &Sigma;(x:A). B(x) — generalizes product types
- **Identity types:** Id_A(a, b) — captures equality
- **Natural number type:** N with 0 and successor
- **Universe types:** U (types of types, with a hierarchy to avoid paradox)
- **Inductive types:** W-types and more general inductive definitions

**Propositions-as-types (Curry-Howard correspondence):**
- Propositions correspond to types
- Proofs correspond to terms (programs)
- &forall; corresponds to &Pi;-types
- &exists; corresponds to &Sigma;-types
- Implication corresponds to function types

### 14.3 Homotopy Type Theory (HoTT) and the Univalence Axiom

A synthesis of Martin-Lof type theory with homotopy theory, developed principally by
Vladimir Voevodsky and collaborators (2006-2013).

**Key addition — the Univalence Axiom:**
- (A = B) &sime; (A &sime; B)
- "Identity is equivalent to equivalence": two types that are equivalent (in the
  homotopy-theoretic sense) are equal.

**Consequences:**
- Isomorphic structures can be identified (a principle mathematicians use informally)
- The identity type Id_A(a, b) is interpreted as a path space
- Types correspond to spaces; terms correspond to points; identity proofs correspond to
  paths; higher identities correspond to homotopies
- Classical and constructive logic coexist as endpoints of a spectrum

---

## 15. Mathematical Physics

### 15.1 Dirac-von Neumann Axioms of Quantum Mechanics (1930/1932)

**Axioms:**
1. The state of a physical system is represented by a unit vector (ray) in a complex
   separable **Hilbert space** H.
2. Observables are represented by self-adjoint (Hermitian) operators on H.
3. The possible measurement outcomes of an observable A are the values in the spectrum of A.
4. **Born rule:** The probability of measuring eigenvalue a in state |&psi;&rang; is
   |&lang;a|&psi;&rang;|&sup2;.
5. **Time evolution:** The state evolves according to the Schrodinger equation:
   i&hbar; d|&psi;&rang;/dt = H|&psi;&rang;, where H is the Hamiltonian operator.
6. **Collapse postulate:** Upon measurement, the state collapses to the eigenstate
   corresponding to the measured eigenvalue.

### 15.2 Wightman Axioms for Quantum Field Theory (1950s/1964)

Axioms for a rigorous mathematical formulation of QFT on Minkowski spacetime:

1. **State space:** States live in a separable Hilbert space with a unitary representation of
   the Poincare group.
2. **Vacuum:** There exists a unique Poincare-invariant vacuum state |0&rang;.
3. **Spectral condition:** The joint spectrum of the energy-momentum operators lies in the
   forward light cone (energy is non-negative).
4. **Fields as operator-valued distributions:** Quantum fields are operator-valued tempered
   distributions on spacetime.
5. **Locality (Microscopic causality):** Fields at spacelike-separated points commute (bosons)
   or anticommute (fermions).
6. **Completeness:** The vacuum is cyclic for the field algebra (the fields applied to the
   vacuum generate a dense subspace of the Hilbert space).

---

## 16. The Landscape: How These Systems Relate

### Foundational Hierarchy

```
Logic (Propositional → Predicate)
  └── Set Theory (ZFC / NBG / MK / NF / ...)
        ├── Number Systems (N → Z → Q → R → C)
        ├── Abstract Algebra (Magma → ... → Group → Ring → Field)
        ├── Order Theory (Partial → Total → Well-Order → Lattice)
        ├── Linear Algebra (Vector Spaces → Normed → Inner Product)
        ├── Topology (Topological Spaces → Separation Axioms)
        ├── Analysis (Metric Spaces → Banach → Hilbert)
        ├── Geometry (Euclidean / Non-Euclidean)
        ├── Measure Theory & Probability
        ├── Algebraic Topology (Eilenberg-Steenrod)
        ├── Combinatorics (Matroids)
        └── Category Theory (as a unifying language)

Alternative Foundations:
  Type Theory (Simple → Dependent → HoTT)
  Category Theory (as a foundation, via topos theory)
```

### Algebraic Structure Hierarchy

```
Magma (closure)
  └── Semigroup (+associativity)
        └── Monoid (+identity)
              └── Group (+inverse)
                    └── Abelian Group (+commutativity)

Ring = Abelian Group (addition) + Monoid (multiplication) + distributivity
  └── Commutative Ring (+commutativity of multiplication)
        └── Integral Domain (+no zero divisors)
              └── Field (+multiplicative inverses)

Module = Abelian Group + Ring action
  └── Vector Space = Module over a Field
        └── Inner Product Space (+inner product)
              └── Hilbert Space (+completeness)
```

### Analytic Structure Hierarchy

```
Set
  └── Topological Space (+open set axioms)
        └── Metric Space (+distance function)
              └── Normed Space (+vector space + norm)
                    └── Banach Space (+completeness)
                          └── Hilbert Space (+inner product)
```

### Key Independence Results

| Statement | Independent of |
|-----------|---------------|
| Axiom of Choice | ZF |
| Continuum Hypothesis | ZFC |
| Parallel Postulate | Euclid's other four postulates |
| Large Cardinal Axioms | ZFC |
| Axiom of Determinacy | ZF (contradicts AC) |
| Godel's Incompleteness | PA cannot prove its own consistency |

---

## Sources

- [Axiomatic System (Wikipedia)](https://en.wikipedia.org/wiki/Axiomatic_system)
- [Wolfram: Axiom Systems of Present-Day Mathematics](https://www.wolframscience.com/metamathematics/axiom-systems-of-present-day-mathematics/)
- [Zermelo-Fraenkel Set Theory (Wikipedia)](https://en.wikipedia.org/wiki/Zermelo%E2%80%93Fraenkel_set_theory)
- [ZF Set Theory (Stanford Encyclopedia of Philosophy)](https://plato.stanford.edu/entries/set-theory/zf.html)
- [Peano Axioms (Wikipedia)](https://en.wikipedia.org/wiki/Peano_axioms)
- [Peano Axioms (Britannica)](https://www.britannica.com/science/Peano-axioms)
- [Euclidean Geometry (Wikipedia)](https://en.wikipedia.org/wiki/Euclidean_geometry)
- [Euclid's Postulates (Wolfram MathWorld)](https://mathworld.wolfram.com/EuclidsPostulates.html)
- [Hilbert's Axioms (Wikipedia)](https://en.wikipedia.org/wiki/Hilbert's_axioms)
- [Hilbert's Axioms (Wolfram MathWorld)](https://mathworld.wolfram.com/HilbertsAxioms.html)
- [Ordered Field Axioms (LibreTexts)](https://math.libretexts.org/Bookshelves/Analysis/Introduction_to_Mathematical_Analysis_I_(Lafferriere_Lafferriere_and_Nguyen)/01:_Tools_for_Analysis/1.04:_Ordered_Field_Axioms)
- [Complete Ordered Field Axioms (Cornell)](https://pi.math.cornell.edu/~zbnorwood/3110-s19/axioms-for-reals.pdf)
- [Ring (Wikipedia)](https://en.wikipedia.org/wiki/Ring_(mathematics))
- [Group Theory (Wikipedia)](https://en.wikipedia.org/wiki/Group_theory)
- [Probability Axioms (Wikipedia)](https://en.wikipedia.org/wiki/Probability_axioms)
- [Kolmogorov Axioms (Book of Statistical Proofs)](https://statproofbook.github.io/D/prob-ax.html)
- [Topological Space (Wikipedia)](https://en.wikipedia.org/wiki/Topological_space)
- [Vector Space Axioms (UCLA - Tao)](https://www.math.ucla.edu/~tao/resource/general/121.1.00s/vector_axioms.html)
- [Vector Space (Wikipedia)](https://en.wikipedia.org/wiki/Vector_space)
- [Boolean Algebra (Wikipedia)](https://en.wikipedia.org/wiki/Boolean_algebra_(structure))
- [Category Theory (Wikipedia)](https://en.wikipedia.org/wiki/Category_theory)
- [Category Theory (Stanford Encyclopedia of Philosophy)](https://plato.stanford.edu/entries/category-theory/)
- [Metric Space (Wikipedia)](https://en.wikipedia.org/wiki/Metric_space)
- [Monoid (Wikipedia)](https://en.wikipedia.org/wiki/Monoid)
- [Semigroup (Wikipedia)](https://en.wikipedia.org/wiki/Semigroup)
- [Tarski's Axioms (Wikipedia)](https://en.wikipedia.org/wiki/Tarski's_axioms)
- [Inner Product Space (Wikipedia)](https://en.wikipedia.org/wiki/Inner_product_space)
- [Hilbert Space (Wikipedia)](https://en.wikipedia.org/wiki/Hilbert_space)
- [Partial Order (Wikipedia)](https://en.wikipedia.org/wiki/Partially_ordered_set)
- [Total Order (Wikipedia)](https://en.wikipedia.org/wiki/Total_order)
- [Completeness of the Real Numbers (Wikipedia)](https://en.wikipedia.org/wiki/Completeness_of_the_real_numbers)
- [Homotopy Type Theory (Wikipedia)](https://en.wikipedia.org/wiki/Homotopy_type_theory)
- [HoTT Book](https://homotopytypetheory.org/book/)
- [Von Neumann-Bernays-Godel Set Theory (Wikipedia)](https://en.wikipedia.org/wiki/Von_Neumann%E2%80%93Bernays%E2%80%93G%C3%B6del_set_theory)
- [Alternative Set Theories (Stanford Encyclopedia of Philosophy)](https://plato.stanford.edu/entries/settheory-alternative/)
- [Quine's New Foundations (Stanford Encyclopedia of Philosophy)](https://plato.stanford.edu/entries/quine-nf/)
- [Eilenberg-Steenrod Axioms (Wikipedia)](https://en.wikipedia.org/wiki/Eilenberg%E2%80%93Steenrod_axioms)
- [Lie Algebra (Wikipedia)](https://en.wikipedia.org/wiki/Lie_algebra)
- [Wightman Axioms (Wikipedia)](https://en.wikipedia.org/wiki/Wightman_axioms)
- [Dirac-von Neumann Axioms (Wikipedia)](https://en.wikipedia.org/wiki/Dirac%E2%80%93von_Neumann_axioms)
- [Large Cardinals and Determinacy (Stanford Encyclopedia of Philosophy)](https://plato.stanford.edu/entries/large-cardinals-determinacy/)
- [Banach Space (Wikipedia)](https://en.wikipedia.org/wiki/Banach_space)
- [Matroid (Wikipedia)](https://en.wikipedia.org/wiki/Matroid)
- [Intuitionistic Type Theory (Stanford Encyclopedia of Philosophy)](https://plato.stanford.edu/entries/type-theory-intuitionistic/)
- [Minimal Axioms for Boolean Algebra (Wikipedia)](https://en.wikipedia.org/wiki/Minimal_axioms_for_Boolean_algebra)
- [Martin-Lof Dependent Type Theory (nLab)](https://ncatlab.org/nlab/show/Martin-L%C3%B6f+dependent+type+theory)
